using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SocialMedia.Application.Recommendation;
using SocialMedia.Infrastructure.Persistence.Sql;
using StackExchange.Redis;

namespace SocialMedia.Infrastructure.Caching.Redis;

public class UniversityPostRankingCache : IUniversityPostRankingCache
{
	private readonly IServiceProvider _scopedServices;
	private readonly IConnectionMultiplexer _redis;

	private const float LIKE_WEIGHT = 0.01f;
	private const float COMMENT_WEIGHT = 0.1f;
	private const float DECAY_PER_DAY_RATE = 0.001f;
	private const float SECONDS_IN_DAY = 86400.0f;
	private const int PAGES_CACHED = 10;
	private static readonly TimeSpan CACHE_EXPIRY = TimeSpan.FromMinutes(15);

	private const string UNI_TRENDING_KEY = "university:{0}:trending";
	private const string FACULTY_KEY = "university:{0}:faculty:{1}";
	private const string INTEREST_KEY = "university:{0}:interests:{1}";

	public UniversityPostRankingCache(
		IServiceProvider scopedServices,
		IConnectionMultiplexer redis)
	{
		_scopedServices = scopedServices;
		_redis = redis;
	}

	public async Task<List<Guid>> RescoreAndCacheAsync(string universityDomain, int pageSize, int page = 1)
	{
		using var scope = _scopedServices.CreateScope();
		var dbContext = scope.ServiceProvider.GetRequiredService<SocialMediaDbContext>();
		var now = DateTime.UtcNow;

		var topIds = await dbContext.Blogs
			.AsNoTracking()
			.Where(p => p.ParentId == null && p.User != null && p.User.UniversityDomain == universityDomain)
			.Select(p => new { p.Id, p.PostedAt, Likes = p.Likes.Count(), Comments = p.Comments.Count() })
			.Select(x => new
			{
				x.Id,
				Score = (x.Likes * LIKE_WEIGHT + x.Comments * COMMENT_WEIGHT)
					* Math.Pow(1 - DECAY_PER_DAY_RATE,
						EF.Functions.DateDiffSecond(x.PostedAt, now) / SECONDS_IN_DAY)
			})
			.OrderByDescending(x => x.Score)
			.Skip((page - 1) * pageSize)
			.Take(PAGES_CACHED * pageSize)
			.Select(x => x.Id)
			.ToListAsync();

		var db = _redis.GetDatabase();
		var key = string.Format(UNI_TRENDING_KEY, universityDomain);

		var deleteTask = db.KeyDeleteAsync(key);
		var pushTask = db.ListRightPushAsync(
			key,
			topIds.Select(id => (RedisValue)id.ToString()).ToArray()
		);

		await Task.WhenAll(deleteTask, pushTask);
		await db.KeyExpireAsync(key, CACHE_EXPIRY);

		return topIds;
	}

	public async Task<List<Guid>> GetPageFromListAsync(string universityDomain, int page, int pageSize)
	{
		var db = _redis.GetDatabase();
		var key = string.Format(UNI_TRENDING_KEY, universityDomain);

		var exists = await db.KeyExistsAsync(key);
		if (!exists || (page - 1) % PAGES_CACHED == 0)
		{
			await RescoreAndCacheAsync(universityDomain, pageSize, page);
		}

		int pageNumber = page % PAGES_CACHED;
		if (pageNumber == 0) pageNumber = PAGES_CACHED;

		long start = (long)(pageNumber - 1) * pageSize;
		long stop = start + pageSize - 1;

		var values = await db.ListRangeAsync(key, start, stop);
		return values.Select(v => Guid.Parse(v!)).ToList();
	}

	public async Task<List<Guid>> GetFacultyPostsAsync(string universityDomain, string facultyCode, int page, int pageSize)
	{
		var db = _redis.GetDatabase();
		var key = string.Format(FACULTY_KEY, universityDomain, facultyCode);

		var exists = await db.KeyExistsAsync(key);
		if (!exists || (page - 1) % PAGES_CACHED == 0)
		{
			await RescoreAndCacheFacultyAsync(universityDomain, facultyCode, pageSize, page);
		}

		int pageNumber = page % PAGES_CACHED;
		if (pageNumber == 0) pageNumber = PAGES_CACHED;

		long start = (long)(pageNumber - 1) * pageSize;
		long stop = start + pageSize - 1;

		var values = await db.ListRangeAsync(key, start, stop);
		return values.Select(v => Guid.Parse(v!)).ToList();
	}

	public async Task<List<Guid>> GetInterestPostsAsync(string universityDomain, List<string> interests, int page, int pageSize)
	{
		if (interests.Count == 0)
			return new List<Guid>();

		// Create a stable cache key from sorted interests
		var interestKey = string.Join(",", interests.OrderBy(i => i));
		var hash = interestKey.GetHashCode().ToString("X");

		var db = _redis.GetDatabase();
		var key = string.Format(INTEREST_KEY, universityDomain, hash);

		var exists = await db.KeyExistsAsync(key);
		if (!exists || (page - 1) % PAGES_CACHED == 0)
		{
			await RescoreAndCacheInterestsAsync(universityDomain, interests, key, pageSize, page);
		}

		int pageNumber = page % PAGES_CACHED;
		if (pageNumber == 0) pageNumber = PAGES_CACHED;

		long start = (long)(pageNumber - 1) * pageSize;
		long stop = start + pageSize - 1;

		var values = await db.ListRangeAsync(key, start, stop);
		return values.Select(v => Guid.Parse(v!)).ToList();
	}

	private async Task RescoreAndCacheFacultyAsync(string universityDomain, string facultyCode, int pageSize, int page)
	{
		using var scope = _scopedServices.CreateScope();
		var dbContext = scope.ServiceProvider.GetRequiredService<SocialMediaDbContext>();
		var now = DateTime.UtcNow;

		var topIds = await dbContext.Blogs
			.AsNoTracking()
			.Where(p => p.ParentId == null &&
						p.User != null &&
						p.User.UniversityDomain == universityDomain &&
						p.User.FacultyCode == facultyCode)
			.Select(p => new { p.Id, p.PostedAt, Likes = p.Likes.Count(), Comments = p.Comments.Count() })
			.Select(x => new
			{
				x.Id,
				Score = (x.Likes * LIKE_WEIGHT + x.Comments * COMMENT_WEIGHT)
					* Math.Pow(1 - DECAY_PER_DAY_RATE,
						EF.Functions.DateDiffSecond(x.PostedAt, now) / SECONDS_IN_DAY)
			})
			.OrderByDescending(x => x.Score)
			.Skip((page - 1) * pageSize)
			.Take(PAGES_CACHED * pageSize)
			.Select(x => x.Id)
			.ToListAsync();

		var db = _redis.GetDatabase();
		var key = string.Format(FACULTY_KEY, universityDomain, facultyCode);

		await db.KeyDeleteAsync(key);
		if (topIds.Count > 0)
		{
			await db.ListRightPushAsync(key, topIds.Select(id => (RedisValue)id.ToString()).ToArray());
			await db.KeyExpireAsync(key, CACHE_EXPIRY);
		}
	}

	private async Task RescoreAndCacheInterestsAsync(string universityDomain, List<string> interests, string key, int pageSize, int page)
	{
		using var scope = _scopedServices.CreateScope();
		var dbContext = scope.ServiceProvider.GetRequiredService<SocialMediaDbContext>();
		var now = DateTime.UtcNow;

		var topIds = await dbContext.Blogs
			.AsNoTracking()
			.Where(p => p.ParentId == null &&
						p.User != null &&
						p.User.UniversityDomain == universityDomain &&
						p.Tags.Any(tag => interests.Contains(tag)))
			.Select(p => new { p.Id, p.PostedAt, Likes = p.Likes.Count(), Comments = p.Comments.Count() })
			.Select(x => new
			{
				x.Id,
				Score = (x.Likes * LIKE_WEIGHT + x.Comments * COMMENT_WEIGHT)
					* Math.Pow(1 - DECAY_PER_DAY_RATE,
						EF.Functions.DateDiffSecond(x.PostedAt, now) / SECONDS_IN_DAY)
			})
			.OrderByDescending(x => x.Score)
			.Skip((page - 1) * pageSize)
			.Take(PAGES_CACHED * pageSize)
			.Select(x => x.Id)
			.ToListAsync();

		var db = _redis.GetDatabase();

		await db.KeyDeleteAsync(key);
		if (topIds.Count > 0)
		{
			await db.ListRightPushAsync(key, topIds.Select(id => (RedisValue)id.ToString()).ToArray());
			await db.KeyExpireAsync(key, CACHE_EXPIRY);
		}
	}
}
