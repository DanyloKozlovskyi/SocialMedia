using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SocialMedia.DataAccess;
using StackExchange.Redis;

namespace SocialMedia.BusinessLogic.Services.Blog.Redis;
public class CacheService : BackgroundService
{
	private readonly IServiceProvider _scopedServices;
	private readonly IConnectionMultiplexer _redis;
	private const float LIKE_WEIGHT = 0.01f;
	private const float COMMENT_WEIGHT = 0.1f;
	private const string ZSET_KEY = "posts:byActivity";
	private const float DECAY_PER_DAY_RATE = 0.001f;
	private const float SECONDS_IN_DAY = 86400.0f;
	private const int DEFAULT_PAGE_SIZE = 10;

	public CacheService(
		IServiceProvider scopedServices,
		IConnectionMultiplexer redis)
	{
		_scopedServices = scopedServices;
		_redis = redis;
	}

	public Task<List<Guid>> RescoreAndCacheAsync(int pageSize)
	{
		// Kick off a one-off background task (don’t await it here).
		return Task.Run(async () =>
		{
			using var scope = _scopedServices.CreateScope();
			var dbContext = scope.ServiceProvider.GetRequiredService<SocialMediaDbContext>();
			var now = DateTime.UtcNow;

			var topIds = await dbContext.Blogs
			  .AsNoTracking()
			  .Select(p => new { p.Id, p.PostedAt, Likes = p.Likes.Count(), Comments = p.Comments.Count() })
			  .Select(x => new
			  {
				  x.Id,
				  Score = (x.Likes * LIKE_WEIGHT + x.Comments * COMMENT_WEIGHT)
					* Math.Pow(1 - DECAY_PER_DAY_RATE,
					  EF.Functions.DateDiffSecond(x.PostedAt, now) / SECONDS_IN_DAY)
			  })
			  .OrderByDescending(x => x.Score)
			  .Take(DEFAULT_PAGE_SIZE * pageSize)
			  .Select(x => x.Id)
			  .ToListAsync();

			// 2) Write them into Redis (ZADD or simple LIST)
			var db = _redis.GetDatabase();
			var batch = db.CreateBatch();
			var deleteTask = batch.KeyDeleteAsync(ZSET_KEY);
			var pushTask = batch.ListRightPushAsync(ZSET_KEY, topIds.Select(g => (RedisValue)g.ToString()).ToArray());

			batch.Execute();

			await Task.WhenAll(deleteTask, pushTask).ConfigureAwait(false);
			return topIds;
		});
	}

	public async Task<List<Guid>> GetPageFromListAsync(int pageNumber, int pageSize)
	{
		var db = _redis.GetDatabase();
		long start = (long)(pageNumber - 1) * pageSize;
		long stop = start + pageSize - 1;
		var values = await db.ListRangeAsync(ZSET_KEY, start, stop);
		var guids = values.Select(v => Guid.Parse(v)).ToList();
		return guids;
	}
	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		await RescoreAndCacheAsync(DEFAULT_PAGE_SIZE);

		while (!stoppingToken.IsCancellationRequested)
		{
			await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken)
					   .ConfigureAwait(false);
			await RescoreAndCacheAsync(DEFAULT_PAGE_SIZE);
		}
	}
}
