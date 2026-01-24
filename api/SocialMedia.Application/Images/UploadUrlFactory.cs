using System.Text.RegularExpressions;

namespace SocialMedia.Application.Images;
public class UploadUrlFactory : IUploadUrlFactory
{
	private readonly IImageRepository _repository;
	private static readonly Regex UnsafeChars = new(@"[^a-zA-Z0-9._\-]", RegexOptions.Compiled);

	public UploadUrlFactory(IImageRepository repository)
	{
		_repository = repository;
	}

	public (string key, string uploadUrl, string contentType) GetBlogUploadUrl(string fileName)
		=> GetUploadUrl("", fileName);

	public (string key, string uploadUrl, string contentType) GetLogoUploadUrl(string fileName)
		=> GetUploadUrl($"logos", fileName);

	private (string key, string uploadUrl, string contentType) GetUploadUrl(string prefix, string fileName)
	{
		var safeFileName = Sanitize(fileName);

		var datePath = DateTime.UtcNow.ToString("yyyy/MM/dd");
		var key = $"{prefix}/{datePath}/{Guid.NewGuid():N}-{safeFileName}";

		var contentType = MimeTypeHelper.Detect(fileName)
						  ?? "application/octet‑stream";

		var uploadUrl = _repository
			.GeneratePresignedUploadUrl(key, contentType)
			?? throw new InvalidOperationException("Presign not supported by this repository");

		return (key, uploadUrl, contentType);
	}

	private static string Sanitize(string s)
		=> UnsafeChars.Replace(s ?? string.Empty, "-");
}

