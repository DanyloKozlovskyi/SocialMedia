namespace SocialMedia.Application.Recommendation;

public interface ICandidateGenerator
{
	CandidateSource Source { get; }
	Task<List<Candidate>> GetCandidatesAsync(Guid userId, HashSet<Guid> excludeIds, int limit);
}
