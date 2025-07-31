
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MimeDetective;
using MimeDetective.Definitions;
using MimeDetective.Engine;
using SocialMedia.Application.Images;
using SocialMedia.Infrastructure.Persistence.Sql;


namespace SocialMedia.Infrastructure.Persistence.Blob.Backfills;
public sealed class BlogBackfillService : ImageBackfillServiceBase
{
	public BlogBackfillService(SocialMediaDbContext db, IImageService imageService, ILogger<BlogBackfillService> logger)
		: base(db, imageService, logger)
	{ }

	public async Task RunAsync(CancellationToken ct)
	{
		//	const int PageSize = 100;

		//	while (true)
		//	{
		//		var batch = await _db.Blogs
		//			.Where(p => p.Image64 != null && p.ImageKey == null)
		//			.OrderBy(p => p.Id)
		//			.Take(PageSize)
		//			.ToListAsync(ct);

		//		if (batch.Count == 0) break;

		//		foreach (var post in batch)
		//		{
		//			try
		//			{
		//				if (!TryDecodeBase64(post.Image64!, out var bytes))
		//				{
		//					_logger.LogWarning("Invalid base64 for post {PostId}", post.Id);
		//					continue;
		//				}

		//				var (mime, ext) = DetectMimeFromBase64(post.Image64!, bytes);

		//				await using var stream = new MemoryStream(bytes, writable: false);

		//				var fileName = $"post-{post.Id}{ext}";
		//				var (key, _, _) = _imageService.GetUploadUrl(fileName);
		//				await _imageService.UploadAsync(stream, key, mime);

		//				post.ImageKey = key;
		//				post.ImageContentType = mime;
		//				//post.Image64 = null;
		//			}
		//			catch (Exception ex)
		//			{
		//				_logger.LogError(ex, "Failed to migrate image for post {PostId}", post.Id);
		//			}
		//		}

		//		await _db.SaveChangesAsync(ct);
		//	}
	}
}

