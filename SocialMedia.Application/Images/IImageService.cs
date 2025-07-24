namespace SocialMedia.Application.Images;
public interface IImageService
{
	public (string key, string uploadUrl, string contentType) GetUploadUrl(string fileName);

	public Task<ImageDownloadResult> DownloadImageAsync(string key);

	public Task DeleteImageAsync(string key);

	public Task UploadAsync(Stream fileStream, string key, string contentType);
}