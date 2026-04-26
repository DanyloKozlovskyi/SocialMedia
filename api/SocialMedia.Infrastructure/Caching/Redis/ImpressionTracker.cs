using SocialMedia.Application.BlogPosts;
using StackExchange.Redis;

namespace SocialMedia.Infrastructure.Caching.Redis;

public class ImpressionTracker : IImpressionTracker
{
	private readonly IConnectionMultiplexer _redis;
	private const int IMPRESSION_TTL_HOURS = 12;

	public ImpressionTracker(IConnectionMultiplexer redis)
	{
		_redis = redis;
	}

	private static string GetKey(Guid userId) => $"impressions:user:{userId}";

	public async Task<HashSet<Guid>> GetImpressionsAsync(Guid userId)
	{
		var db = _redis.GetDatabase();
		var key = GetKey(userId);

		var members = await db.SetMembersAsync(key);

		var impressions = new HashSet<Guid>();
		foreach (var member in members)
		{
			if (Guid.TryParse(member, out var postId))
			{
				impressions.Add(postId);
			}
		}

		return impressions;
	}

	public async Task LogImpressionsAsync(Guid userId, IEnumerable<Guid> postIds)
	{
		var db = _redis.GetDatabase();
		var key = GetKey(userId);

		var values = postIds.Select(id => (RedisValue)id.ToString()).ToArray();

		if (values.Length == 0)
			return;

		// Fire-and-forget: add post IDs to the set and refresh TTL
		_ = Task.Run(async () =>
		{
			await db.SetAddAsync(key, values);
			await db.KeyExpireAsync(key, TimeSpan.FromHours(IMPRESSION_TTL_HOURS));
		});
	}
}
