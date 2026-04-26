using SocialMedia.Application.BlogPosts;

namespace SocialMedia.Application.Recommendation;

public class TrendingGenerator : ICandidateGenerator
{
	private readonly IPostRankingCache _cache;

	public CandidateSource Source => CandidateSource.Trending;

	public TrendingGenerator(IPostRankingCache cache)
	{
		_cache = cache;
	}

	public async Task<List<Candidate>> GetCandidatesAsync(Guid userId, HashSet<Guid> excludeIds, int limit)
	{
		var trendingIds = await _cache.GetPageFromListAsync(1, limit * 2);

		var candidates = trendingIds
			.Where(id => !excludeIds.Contains(id))
			.Take(limit)
			.Select((id, index) => new Candidate
			{
				PostId = id,
				AuthorId = Guid.Empty,
				Score = 1.0 - (index * 0.01),
				Source = CandidateSource.Trending
			})
			.ToList();

		return candidates;
	}
}
