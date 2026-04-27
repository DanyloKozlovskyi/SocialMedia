using SocialMedia.Application.Identity.Dtos;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Identity;

public interface IUserFollowRepository
{
	Task<UserFollow> Create(UserFollow entity);
	Task Delete(UserFollow entity);
	Task<UserFollow?> GetByFollowerAndFollowing(Guid followerId, Guid followingId);
	Task<bool> Exists(Guid followerId, Guid followingId);
	Task<int> GetFollowersCount(Guid userId);
	Task<int> GetFollowingCount(Guid userId);
	Task<IEnumerable<FollowResponseDto>> GetFollowers(Guid userId, int page, int pageSize);
	Task<IEnumerable<FollowResponseDto>> GetFollowing(Guid userId, int page, int pageSize);
	Task<HashSet<Guid>> GetFollowingIds(Guid userId);
	Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
