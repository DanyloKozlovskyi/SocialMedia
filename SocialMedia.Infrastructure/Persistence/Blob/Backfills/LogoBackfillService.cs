using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SocialMedia.Application.Images;
using SocialMedia.Infrastructure.Persistence.Sql;

namespace SocialMedia.Infrastructure.Persistence.Blob.Backfills;
public class LogoBackfillService : ImageBackfillServiceBase
{
	private const int BatchSize = 100;
	private readonly IUploadUrlFactory _uploadFactory;

	public LogoBackfillService(SocialMediaDbContext db, IImageService imageService, ILogger<BlogBackfillService> logger, IUploadUrlFactory factory)
		: base(db, imageService, logger)
	{
		_uploadFactory = factory;
	}

	public async Task RunAsync(CancellationToken ct)
	{
		while (true)
		{
			// 1) grab a batch of users with an inline Logo but no LogoKey yet
			var users = await _db.Users
				.Where(u => u.Logo != null && u.LogoKey == null)
				.OrderBy(u => u.Id)
				.Take(BatchSize)
				.ToListAsync(ct);

			if (users.Count == 0)
			{
				_logger.LogInformation("Logo backfill complete.");
				break;
			}

			foreach (var user in users)
			{
				try
				{
					if (!TryDecodeBase64(user.Logo!, out var bytes))
					{
						_logger.LogWarning("Invalid Base64 logo for user {UserId}", user.Id);
						continue;
					}

					var (mime, ext) = DetectMimeFromBase64(user.Logo!, bytes);
					await using var stream = new MemoryStream(bytes, writable: false);

					var fileName = $"logo-{user.Id}{ext}";
					var (key, _, _) = _uploadFactory.GetLogoUploadUrl(fileName);

					// 5) upload to your single R2 bucket under "logos/"
					await _imageService.UploadAsync(stream, key, mime);

					user.LogoKey = key;
					user.LogoContentType = mime;

					// optionally clear the inline column:
					// user.Logo = null;
				}
				catch (Exception ex)
				{
					_logger.LogError(ex, "Failed to backfill logo for user {UserId}", user.Id);
				}
			}

			await _db.SaveChangesAsync(ct);
		}
	}
}

