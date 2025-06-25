using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SocialMedia.Domain.Entities;
using SocialMedia.Infrastructure.Persistence.Seeding.Interfaces;
using SocialMedia.Infrastructure.Persistence.Seeding.Options;

namespace SocialMedia.Infrastructure.Persistence.Seeding;
public sealed class LikeSeeder : ILikeSeeder
{
	private readonly SocialMediaDbContext _ctx;
	private readonly LikeSeedOptions _opt;
	private readonly Random _rng = new();

	public LikeSeeder(SocialMediaDbContext ctx, IOptions<LikeSeedOptions> opt)
	{
		_ctx = ctx;
		_opt = opt.Value;
	}

	public async Task SeedAsync(CancellationToken ct = default)
	{
		if (await _ctx.Likes.GroupBy(x => x.PostId).Select(g => g.Count()).MaxAsync(ct) >= _opt.MaxPerPost) return;

		var userIds = await _ctx.Users.Select(u => u.Id).ToListAsync(ct);
		var postIds = await _ctx.Blogs.Select(p => p.Id).ToListAsync(ct);
		if (userIds.Count == 0 || postIds.Count == 0) return;

		var likes = new List<Like>();
		var seenPair = new HashSet<(Guid UserId, Guid PostId)>();

		foreach (var postId in postIds)
		{
			int target = _rng.Next(_opt.MinPerPost, _opt.MaxPerPost + 1);

			for (int i = 0; i < target; i++)
			{
				var userId = userIds[_rng.Next(userIds.Count)];

				if (!seenPair.Add((userId, postId)))
					continue;

				likes.Add(new Like
				{
					Id = Guid.NewGuid(),
					UserId = userId,
					PostId = postId,
					CreatedAt = DateTime.UtcNow.AddMinutes(-_rng.Next(0, 60 * 24 * 30))
				});
			}
		}

		await _ctx.Likes.AddRangeAsync(likes, ct);
		await _ctx.SaveChangesAsync(ct);
	}
}