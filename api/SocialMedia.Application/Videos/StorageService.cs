using Amazon.S3;
using Amazon.S3.Model;

namespace SocialMedia.Application.Videos;

public class StorageService : IStorageService
{
	private readonly IAmazonS3 _s3;
	private const string Bucket = "videos";
	private const double UploadUrlExpiryMinutes = 5;
	private const double DownloadUrlExpiryMinutes = 60;

	public StorageService(IAmazonS3 s3)
	{
		_s3 = s3;
	}

	public (string uploadUrl, string storageKey) GeneratePresignedUploadUrl(string fileName, string contentType)
	{
		var storageKey = $"{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid()}-{fileName}.mp4";

		var request = new GetPreSignedUrlRequest
		{
			BucketName = Bucket,
			Key = storageKey,
			Verb = HttpVerb.PUT,
			Expires = DateTime.UtcNow.AddMinutes(UploadUrlExpiryMinutes),
			ContentType = contentType
		};

		var uploadUrl = _s3.GetPreSignedURL(request);
		return (uploadUrl, storageKey);
	}

	public string GeneratePresignedDownloadUrl(string storageKey)
	{
		var request = new GetPreSignedUrlRequest
		{
			BucketName = Bucket,
			Key = storageKey,
			Verb = HttpVerb.GET,
			Expires = DateTime.UtcNow.AddMinutes(DownloadUrlExpiryMinutes)
		};

		return _s3.GetPreSignedURL(request);
	}
}
