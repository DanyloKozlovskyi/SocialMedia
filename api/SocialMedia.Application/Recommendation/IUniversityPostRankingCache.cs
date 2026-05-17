namespace SocialMedia.Application.Recommendation;

public interface IUniversityPostRankingCache
{
	Task<List<Guid>> RescoreAndCacheAsync(string universityDomain, int pageSize, int page = 1);

	Task<List<Guid>> GetPageFromListAsync(string universityDomain, int page, int pageSize);

	Task<List<Guid>> GetFacultyPostsAsync(string universityDomain, string facultyCode, int page, int pageSize);

	Task<List<Guid>> GetInterestPostsAsync(string universityDomain, List<string> interests, int page, int pageSize);
}
