using Microsoft.EntityFrameworkCore;
using SocialMedia.Application.Identity;
using SocialMedia.Application.Identity.Dtos;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Repositories;

public class UserFollowRepository : IUserFollowRepository
{
	private readonly SocialMediaDbContext _dbContext;

	public UserFollowRepository(SocialMediaDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<UserFollow> Create(UserFollow entity)
	{
		await _dbContext.UserFollows.AddAsync(entity).ConfigureAwait(false);
		await _dbContext.SaveChangesAsync().ConfigureAwait(false);
		return entity;
	}

	public async Task Delete(UserFollow entity)
	{
		_dbContext.UserFollows.Remove(entity);
		await _dbContext.SaveChangesAsync().ConfigureAwait(false);
	}

	public async Task<UserFollow?> GetByFollowerAndFollowing(Guid followerId, Guid followingId)
	{
		return await _dbContext.UserFollows
			.FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId)
			.ConfigureAwait(false);
	}

	public async Task<bool> Exists(Guid followerId, Guid followingId)
	{
		return await _dbContext.UserFollows
			.AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId)
			.ConfigureAwait(false);
	}

	public async Task<int> GetFollowersCount(Guid userId)
	{
		return await _dbContext.UserFollows
			.CountAsync(f => f.FollowingId == userId)
			.ConfigureAwait(false);
	}

	public async Task<int> GetFollowingCount(Guid userId)
	{
		return await _dbContext.UserFollows
			.CountAsync(f => f.FollowerId == userId)
			.ConfigureAwait(false);
	}

	public async Task<IEnumerable<FollowResponseDto>> GetFollowers(Guid userId, int page, int pageSize)
	{
		return await _dbContext.UserFollows
			.Where(f => f.FollowingId == userId)
			.OrderByDescending(f => f.CreatedAt)
			.Skip((page - 1) * pageSize)
			.Take(pageSize)
			.Select(f => new FollowResponseDto
			{
				UserId = f.FollowerId,
				UserName = f.Follower!.UserName,
				Name = f.Follower.Name,
				LogoKey = f.Follower.LogoKey,
				LogoContentType = f.Follower.LogoContentType,
				FollowedAt = f.CreatedAt
			})
			.ToListAsync()
			.ConfigureAwait(false);
	}

	public async Task<IEnumerable<FollowResponseDto>> GetFollowing(Guid userId, int page, int pageSize)
	{
		return await _dbContext.UserFollows
			.Where(f => f.FollowerId == userId)
			.OrderByDescending(f => f.CreatedAt)
			.Skip((page - 1) * pageSize)
			.Take(pageSize)
			.Select(f => new FollowResponseDto
			{
				UserId = f.FollowingId,
				UserName = f.Following!.UserName,
				Name = f.Following.Name,
				LogoKey = f.Following.LogoKey,
				LogoContentType = f.Following.LogoContentType,
				FollowedAt = f.CreatedAt
			})
			.ToListAsync()
			.ConfigureAwait(false);
	}

	public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
	{
		return _dbContext.SaveChangesAsync(cancellationToken);
	}
}
