using SocialMedia.Application.Identity.Dtos;

namespace SocialMedia.Application.Identity;

public interface IUserFollowService
{
	Task<bool> Follow(Guid followerId, Guid followingId);
	Task<bool> Unfollow(Guid followerId, Guid followingId);
	Task<FollowStatusDto> GetFollowStatus(Guid? currentUserId, Guid targetUserId);
	Task<IEnumerable<FollowResponseDto>> GetFollowers(Guid userId, int page, int pageSize);
	Task<IEnumerable<FollowResponseDto>> GetFollowing(Guid userId, int page, int pageSize);
}
