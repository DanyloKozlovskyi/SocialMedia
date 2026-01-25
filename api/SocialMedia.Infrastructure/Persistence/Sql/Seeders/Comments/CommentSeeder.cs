using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Seeders.Comments;
public sealed class CommentSeeder : ICommentSeeder
{
	private readonly SocialMediaDbContext _ctx;
	private readonly CommentSeedOptions _opt;
	private readonly Faker _faker = new();
	private readonly Random _rng = new();

	private record ImageCache(string DataUri);

	public CommentSeeder(SocialMediaDbContext ctx, IOptions<CommentSeedOptions> opt)
	{
		_ctx = ctx;
		_opt = opt.Value;
	}

	public async Task SeedAsync(CancellationToken ct = default)
	{
		if (await _ctx.Blogs.CountAsync(p => p.ParentId != null, ct) >= _opt.CommentCount)
			return;

		var parentPosts = await _ctx.Blogs
									.Where(p => p.ParentId == null)
									.Select(p => p.Id)
									.ToListAsync(ct);
		if (parentPosts.Count == 0) return;

		var userIds = await _ctx.Users.Select(u => u.Id).ToListAsync(ct);
		if (userIds.Count == 0) return;

		var images = Directory.EnumerateFiles(_opt.ImagesDirectory)
							  .Where(f => IsImage(f))
							  .Select(f => new ImageCache(ToDataUri(f)))
							  .ToList();
		if (images.Count == 0) throw new InvalidOperationException("No images found for comments");

		var comments = new List<BlogPost>(_opt.CommentCount);

		for (int i = 0; i < _opt.CommentCount; i++)
		{
			var parentId = parentPosts[_rng.Next(parentPosts.Count)];
			var authorId = userIds[_rng.Next(userIds.Count)];

			bool withImage = _rng.NextDouble() < _opt.ImageProbability;
			string? img64 = withImage ? images[_rng.Next(images.Count)].DataUri : null;

			comments.Add(new BlogPost
			{
				Id = Guid.NewGuid(),
				Description = _faker.Lorem.Sentence(_rng.Next(5, 14)),
				//Image64 = img64,
				PostedAt = DateTime.UtcNow.AddMinutes(-_rng.Next(0, 60 * 24 * 30)),
				UserId = authorId,
				ParentId = parentId
			});
		}

		await _ctx.Blogs.AddRangeAsync(comments, ct);
		await _ctx.SaveChangesAsync(ct);
	}

	private static bool IsImage(string file)
		=> new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" }.Contains(Path.GetExtension(file).ToLowerInvariant());

	private static string ToDataUri(string path)
	{
		var bytes = File.ReadAllBytes(path);
		var mime = Path.GetExtension(path).ToLowerInvariant() switch
		{
			".jpg" or ".jpeg" => "image/jpeg",
			".png" => "image/png",
			".gif" => "image/gif",
			".webp" => "image/webp",
			_ => "application/octet-stream"
		};
		return $"data:{mime};base64,{Convert.ToBase64String(bytes)}";
	}
}
