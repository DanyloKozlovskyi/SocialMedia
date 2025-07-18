namespace SocialMedia.Application.BlogPosts;
public interface IImageRepository
{
	Task UploadAsync(Stream fileStream, string key, string contentType);
	Task<Stream> DownloadAsync(string key);
	Task DeleteAsync(string key);
	// …any other S3 operations you need
}

