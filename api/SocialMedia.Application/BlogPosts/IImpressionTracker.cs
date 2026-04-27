namespace SocialMedia.Application.BlogPosts;

public interface IImpressionTracker
{
	Task<HashSet<Guid>> GetImpressionsAsync(Guid userId);
	Task LogImpressionsAsync(Guid userId, IEnumerable<Guid> postIds);
}
