using SocialMedia.Application.Identity.Dtos;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Identity;

public class UserFollowService : IUserFollowService
{
	private readonly IUserFollowRepository _userFollowRepository;

	public UserFollowService(IUserFollowRepository userFollowRepository)
	{
		_userFollowRepository = userFollowRepository;
	}

	public async Task<bool> Follow(Guid followerId, Guid followingId)
	{
		if (followerId == followingId)
			return false;

		var exists = await _userFollowRepository.Exists(followerId, followingId);
		if (exists)
			return false;

		var follow = new UserFollow
		{
			Id = Guid.NewGuid(),
			FollowerId = followerId,
			FollowingId = followingId,
			CreatedAt = DateTime.UtcNow
		};

		await _userFollowRepository.Create(follow);
		return true;
	}

	public async Task<bool> Unfollow(Guid followerId, Guid followingId)
	{
		var follow = await _userFollowRepository.GetByFollowerAndFollowing(followerId, followingId);
		if (follow == null)
			return false;

		await _userFollowRepository.Delete(follow);
		return true;
	}

	public async Task<FollowStatusDto> GetFollowStatus(Guid? currentUserId, Guid targetUserId)
	{
		var isFollowing = currentUserId.HasValue && await _userFollowRepository.Exists(currentUserId.Value, targetUserId);
		var followersCount = await _userFollowRepository.GetFollowersCount(targetUserId);
		var followingCount = await _userFollowRepository.GetFollowingCount(targetUserId);

		return new FollowStatusDto
		{
			IsFollowing = isFollowing,
			FollowersCount = followersCount,
			FollowingCount = followingCount
		};
	}

	public async Task<IEnumerable<FollowResponseDto>> GetFollowers(Guid userId, int page, int pageSize)
	{
		return await _userFollowRepository.GetFollowers(userId, page, pageSize);
	}

	public async Task<IEnumerable<FollowResponseDto>> GetFollowing(Guid userId, int page, int pageSize)
	{
		return await _userFollowRepository.GetFollowing(userId, page, pageSize);
	}
}
