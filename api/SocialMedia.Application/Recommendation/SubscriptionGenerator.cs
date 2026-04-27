using Microsoft.EntityFrameworkCore;
using SocialMedia.Application.BlogPosts;
using SocialMedia.Application.Identity;

namespace SocialMedia.Application.Recommendation;

public class SubscriptionGenerator : ICandidateGenerator
{
	private readonly IBlogRepository _blogRepository;
	private readonly IUserFollowRepository _userFollowRepository;

	public CandidateSource Source => CandidateSource.Subscription;

	public SubscriptionGenerator(IBlogRepository blogRepository, IUserFollowRepository userFollowRepository)
	{
		_blogRepository = blogRepository;
		_userFollowRepository = userFollowRepository;
	}

	public async Task<List<Candidate>> GetCandidatesAsync(Guid userId, HashSet<Guid> excludeIds, int limit)
	{
		var followedUserIds = await _userFollowRepository.GetFollowingIds(userId);

		if (followedUserIds.Count == 0)
			return new List<Candidate>();

		var recentCutoff = DateTime.UtcNow.AddDays(-14);

		var candidates = await _blogRepository
			.GetByFilterNoTracking(x =>
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
