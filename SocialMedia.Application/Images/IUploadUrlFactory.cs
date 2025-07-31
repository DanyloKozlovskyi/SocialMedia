namespace SocialMedia.Application.Images;
public interface IUploadUrlFactory
{
	(string key, string uploadUrl, string contentType) GetBlogUploadUrl(string fileName);

	(string key, string uploadUrl, string contentType) GetLogoUploadUrl(string fileName);
}

