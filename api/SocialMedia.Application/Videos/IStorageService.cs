namespace SocialMedia.Application.Videos;

public interface IStorageService
{
	(string uploadUrl, string storageKey) GeneratePresignedUploadUrl(string fileName, string contentType);
	string GeneratePresignedDownloadUrl(string storageKey);
}
