namespace SocialMedia.Application.Recommendation;

public interface IFeedMixer
{
	Task<List<Guid>> GetMixedFeedAsync(Guid userId, HashSet<Guid> excludeIds, int pageSize);
}
