namespace SocialMedia.Application.Images;
using MimeDetective;                                        // :contentReference[oaicite:0]{index=0}
using MimeDetective.Definitions;
public class ImageService : IImageService
{
	private readonly IImageRepository _repository;
	private readonly IUploadUrlFactory _factory;

	private static readonly IContentInspector _inspector = new ContentInspectorBuilder
	{
		Definitions = DefaultDefinitions.All()
	}.Build();

	public ImageService(IImageRepository repository, IUploadUrlFactory factory)
	{
		_repository = repository;
		_factory = factory;
	}

	public async Task<bool> ValidateContentAsync(string key)
	{
		var downloadResult = await DownloadImageAsync(key);
		if (downloadResult == null)
			return false;

		var stream = downloadResult.ImageStream;
		stream.Position = 0;
		const int maxHeaderSize = 8 * 1024;
		var header = new byte[maxHeaderSize];
		int bytesRead = await stream.ReadAsync(header, 0, maxHeaderSize);

		var results = _inspector.Inspect(header.Take(bytesRead).ToArray());

		var best = results.FirstOrDefault();
		var actualMime = best?.Definition?.File?.MimeType;

		return string.Equals(actualMime, downloadResult.ContentType,
							 StringComparison.OrdinalIgnoreCase);
	}

	public (string key, string uploadUrl, string contentType) GetUploadUrl(string fileName)
	{
		var key = $"{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid()}-{fileName}";
		var contentType = MimeTypeHelper.Detect(fileName) ?? "application/octet-stream";

		var presignUrl = _repository.GeneratePresignedUploadUrl(key, contentType)
			?? throw new InvalidOperationException("Presign not supported by this repository");
		return (key, presignUrl, contentType);
	}

	public (string key, string uploadUrl, string contentType) GetUploadUrlForBlog(string fileName)
	{
		var (key, presignedUrl, contentType) = _factory.GetBlogUploadUrl(fileName);

		return (key, presignedUrl, contentType);
	}

	public (string key, string uploadUrl, string contentType) GetUploadUrlForLogo(string fileName)
	{
		var (key, presignedUrl, contentType) = _factory.GetLogoUploadUrl(fileName);

		return (key, presignedUrl, contentType);
	}

	public Task<ImageDownloadResult> DownloadImageAsync(string key)
		=> _repository.DownloadAsync(key);

	public Task DeleteImageAsync(string key)
		=> _repository.DeleteAsync(key);

	public Task UploadAsync(Stream fileStream, string key, string contentType)
	=> _repository.UploadAsync(fileStream, key, contentType);

	public string GetDownloadUrl(string key)
	{
		return _repository.GeneratePresignedDownloadUrl(key);
	}
}
