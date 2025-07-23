namespace SocialMedia.Application.Images;
public interface IImageRepository
{
	Task UploadAsync(Stream fileStream, string key, string contentType);
	Task<Stream> DownloadAsync(string key);
	Task DeleteAsync(string key);
	string GeneratePresignedUploadUrl(string key, string contentType, double expiresInMinutes = 15);
}

