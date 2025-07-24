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
			ContentType = contentType,
			DisablePayloadSigning = true,
			DisableDefaultChecksumValidation = true
		};
		await _s3.PutObjectAsync(req);
	}

	public async Task<ImageDownloadResult> DownloadAsync(string key)
	{
		try
		{
			var req = new GetObjectRequest { BucketName = Bucket, Key = key };

			using var resp = await _s3.GetObjectAsync(req);

			string contentType = resp.Headers.ContentType;

			var ms = new MemoryStream();
			await resp.ResponseStream.CopyToAsync(ms);
			ms.Position = 0;

			return new ImageDownloadResult
			{
				ImageStream = ms,
				ContentType = contentType
			};
		}
		catch (AmazonS3Exception s3Ex)
		{
			// Log the specific S3 error, especially "NoSuchKey"
			Console.WriteLine($"Amazon S3 Error in S3BlobRepository.DownloadAsync for key '{key}': {s3Ex.Message}");
			Console.WriteLine($"S3 Error Code: {s3Ex.ErrorCode}");

			return null;
		}
		catch (Exception ex)
		{
			Console.WriteLine($"An unexpected error occurred in S3BlobRepository.DownloadAsync for key '{key}': {ex.Message}");
			return null;
		}
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
	public string GeneratePresignedDownloadUrl(string key, double expiresInMinutes = 15)
	{
		var getRequest = new GetPreSignedUrlRequest
		{
			BucketName = Bucket,
			Key = key,
			Verb = HttpVerb.GET,
			Expires = DateTime.UtcNow.AddMinutes(expiresInMinutes)
		};
		return _s3.GetPreSignedURL(getRequest);
	}
}
