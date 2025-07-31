namespace SocialMedia.Application.Images;
public interface IImageService
{
	(string key, string uploadUrl, string contentType) GetUploadUrl(string fileName);
	Task<ImageDownloadResult> DownloadImageAsync(string key);
	Task DeleteImageAsync(string key);
	Task UploadAsync(Stream fileStream, string key, string contentType);
	string GetDownloadUrl(string key);
	Task<bool> ValidateContentAsync(string key);
	(string key, string uploadUrl, string contentType) GetUploadUrlForLogo(string fileName);
	(string key, string uploadUrl, string contentType) GetUploadUrlForBlog(string fileName);
}