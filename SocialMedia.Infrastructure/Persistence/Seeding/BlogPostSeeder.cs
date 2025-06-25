using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SocialMedia.Domain.Entities;
using SocialMedia.Infrastructure.Persistence.Seeding.Interfaces;
using SocialMedia.Infrastructure.Persistence.Seeding.Options;

namespace SocialMedia.Infrastructure.Persistence.Seeding;
public sealed class BlogPostSeeder : IBlogPostSeeder
{
	private readonly SocialMediaDbContext _ctx;
	private readonly BlogPostSeedOptions _opt;
	private readonly Random _rng = new();

	public BlogPostSeeder(SocialMediaDbContext ctx, IOptions<BlogPostSeedOptions> opt)
	{
		_ctx = ctx;
		_opt = opt.Value;
	}

	public async Task SeedAsync(int targetCount = 300, CancellationToken ct = default)
	{
		// don’t over-seed
		if (await _ctx.Blogs.CountAsync(ct) >= targetCount) return;

		var userIds = await _ctx.Users.Select(u => u.Id).ToListAsync(ct);
		if (userIds.Count == 0) throw new InvalidOperationException("No users in DB!");

		var images = LoadImages(_opt.ImagesCsvPath, _opt.ImagesDirectory);

		if (images.Count == 0) throw new InvalidOperationException("No images found!");

		var posts = new List<BlogPost>(targetCount);

		for (int i = 0; i < targetCount; i++)
		{
			var img = images[_rng.Next(images.Count)];          // random picture
			var userId = userIds[_rng.Next(userIds.Count)];     // random author
			var desc = Rephrase(img.Label, i);                  // fun variation

			posts.Add(new BlogPost
			{
				Id = Guid.NewGuid(),
				Description = desc,
				Image64 = img.Base64DataUri,
				PostedAt = DateTime.UtcNow.AddMinutes(-_rng.Next(0, 60 * 24 * 30)), // last 30 days
				UserId = userId
			});
		}

		await _ctx.Blogs.AddRangeAsync(posts, ct);
		await _ctx.SaveChangesAsync(ct);
	}

	private sealed record ImageInfo(string Label, string Base64DataUri);

	private List<ImageInfo> LoadImages(string csvPath, string dir)
	{
		var list = new List<ImageInfo>();
		foreach (var line in File.ReadLines(csvPath).Skip(1))
		{
			var p = line.Split(',', 3, StringSplitOptions.TrimEntries);
			if (p.Length < 2) continue;
			var file = Path.Combine(dir, p[0]);
			if (!File.Exists(file)) continue;

			var bytes = File.ReadAllBytes(file);
			var mime = GetMime(Path.GetExtension(file));
			var data = Convert.ToBase64String(bytes);
			list.Add(new ImageInfo(p[1], $"data:{mime};base64,{data}"));
		}
		return list;
	}

	private static string GetMime(string ext) => ext.ToLowerInvariant() switch
	{
		".jpg" or ".jpeg" => "image/jpeg",
		".png" => "image/png",
		".gif" => "image/gif",
		".webp" => "image/webp",
		_ => "application/octet-stream"
	};

	// very light pseudo-paraphrasing with five templates
	private string Rephrase(string label, int index) => (index % 5) switch
	{
		0 => $"Exploring {label}: a breathtaking sight.",
		1 => $"{label} – captured from a new angle.",
		2 => $"Have you ever seen {label} like this?",
		3 => $"Another look at the majestic {label}.",
		_ => $"{label} in all its glory."
	};
}
