namespace SocialMedia.Application.Images;
public class ImageService : IImageService
{
	private readonly IImageRepository _repository;

	public ImageService(IImageRepository repository)
	{
		_repository = repository;
	}

	public (string key, string uploadUrl, string contentType) GetUploadUrl(string fileName)
	{
		var key = $"{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid()}-{fileName}";
		var contentType = MimeTypeHelper.Detect(fileName);

		// Use concrete repo to generate presigned URL
		var presignUrl = _repository.GeneratePresignedUploadUrl(key, contentType)
			?? throw new InvalidOperationException("Presign not supported by this repository");
		return (key, presignUrl, contentType);
	}

	public Task<Stream> DownloadImageAsync(string key)
		=> _repository.DownloadAsync(key);

	public Task DeleteImageAsync(string key)
		=> _repository.DeleteAsync(key);

	public Task UploadAsync(Stream fileStream, string key, string contentType)
	=> _repository.UploadAsync(fileStream, key, contentType);
}
