using SocialMedia.Application.BlogPosts;

namespace SocialMedia.Application.Recommendation;

public interface IUniversityFeedService
{
	Task<UniversityFeedResult> GetUniversityFeedAsync(Guid userId, int page = 1, int pageSize = 30);
}

public class UniversityFeedResult
{
	public List<PostResponseModel> Posts { get; set; } = new();
	public int TotalCount { get; set; }
	public int Page { get; set; }
	public int PageSize { get; set; }
	public bool HasMore { get; set; }
}
