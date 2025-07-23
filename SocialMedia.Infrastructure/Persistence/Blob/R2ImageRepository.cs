using Amazon.S3;
using Amazon.S3.Model;
using SocialMedia.Application.Images;

namespace SocialMedia.Infrastructure.Persistence.Blob;
public class R2ImageRepository : IImageRepository
{
	private readonly IAmazonS3 _s3;
	private const string Bucket = "blob-images";

	public R2ImageRepository(IAmazonS3 s3)
	{
		_s3 = s3;
	}

	public async Task UploadAsync(Stream fileStream, string key, string contentType)
	{
		var req = new PutObjectRequest
		{
			BucketName = Bucket,
			Key = key,
			InputStream = fileStream,
			ContentType = contentType
		};
		await _s3.PutObjectAsync(req);
	}

	public async Task<Stream> DownloadAsync(string key)
	{
		var req = new GetObjectRequest { BucketName = Bucket, Key = key };
		using var resp = await _s3.GetObjectAsync(req);
		var ms = new MemoryStream();
		await resp.ResponseStream.CopyToAsync(ms);
		ms.Position = 0;
		return ms;
	}

	public async Task DeleteAsync(string key)
	{
		await _s3.DeleteObjectAsync(new DeleteObjectRequest
		{
			BucketName = Bucket,
			Key = key
		});
	}

	public string GeneratePresignedUploadUrl(string key, string contentType, double expiresInMinutes = 15)
	{
		var request = new GetPreSignedUrlRequest
		{
			BucketName = Bucket,
			Key = key,
			Verb = HttpVerb.PUT,
			Expires = DateTime.UtcNow.AddMinutes(expiresInMinutes),
			ContentType = contentType
		};
		return _s3.GetPreSignedURL(request);
	}
}
