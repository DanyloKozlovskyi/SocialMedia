using Microsoft.EntityFrameworkCore;

namespace SocialMedia.Application.Recommendation;

public class SubscriptionGenerator : ICandidateGenerator
{
	private readonly IRecommendationDbContextFactory _contextFactory;

	public CandidateSource Source => CandidateSource.Subscription;

	public SubscriptionGenerator(IRecommendationDbContextFactory contextFactory)
	{
		_contextFactory = contextFactory;
	}

	public async Task<List<Candidate>> GetCandidatesAsync(Guid userId, HashSet<Guid> excludeIds, int limit)
	{
		await using var context = await _contextFactory.CreateDbContextAsync();

		var followedUserIds = await context.UserFollows
			.AsNoTracking()
			.Where(f => f.FollowerId == userId)
			.Select(f => f.FollowingId)
			.ToListAsync();

		if (followedUserIds.Count == 0)
			return new List<Candidate>();

		var recentCutoff = DateTime.UtcNow.AddDays(-14);

		var candidates = await context.Blogs
			.AsNoTracking()
			.Where(x =>
				x.ParentId == null &&
				followedUserIds.Contains(x.UserId) &&
				x.PostedAt >= recentCutoff &&
				!excludeIds.Contains(x.Id))
			.OrderByDescending(x => x.PostedAt)
			.Take(limit)
			.Select(x => new Candidate
			{
				PostId = x.Id,
				AuthorId = x.UserId,
				Score = 1.0,
				Source = CandidateSource.Subscription
			})
			.ToListAsync();

		return candidates;
	}
}
