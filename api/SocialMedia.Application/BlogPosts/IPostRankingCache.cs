namespace SocialMedia.Application.BlogPosts;
public interface IPostRankingCache
{
	public Task<List<Guid>> RescoreAndCacheAsync(int pageSize, int page = 1);

	public Task<List<Guid>> GetPageFromListAsync(int page, int pageSize);
}
