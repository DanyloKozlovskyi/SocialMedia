using Microsoft.EntityFrameworkCore;

namespace SocialMedia.Application.Recommendation;

public class ExplorationGenerator : ICandidateGenerator
{
	private readonly IRecommendationDbContextFactory _contextFactory;

	public CandidateSource Source => CandidateSource.Exploration;

	public ExplorationGenerator(IRecommendationDbContextFactory contextFactory)
	{
		_contextFactory = contextFactory;
	}

	public async Task<List<Candidate>> GetCandidatesAsync(Guid userId, HashSet<Guid> excludeIds, int limit)
	{
		await using var context = await _contextFactory.CreateDbContextAsync();
		var recentCutoff = DateTime.UtcNow.AddDays(-7);

		var recentPosts = await context.Blogs
			.AsNoTracking()
			.Where(x =>
				x.ParentId == null &&
				x.PostedAt >= recentCutoff &&
				!excludeIds.Contains(x.Id))
			.Select(x => new { x.Id, x.UserId })
			.ToListAsync();

		if (recentPosts.Count == 0)
			return new List<Candidate>();

		var random = Random.Shared;
		var shuffled = recentPosts.OrderBy(_ => random.Next()).Take(limit);

		return shuffled.Select(p => new Candidate
		{
			PostId = p.Id,
			AuthorId = p.UserId,
			Score = 0.5 + random.NextDouble() * 0.1,
			Source = CandidateSource.Exploration
		}).ToList();
	}
}
