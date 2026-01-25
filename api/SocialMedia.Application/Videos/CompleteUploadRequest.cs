namespace SocialMedia.Application.Videos;

public class CompleteUploadRequest
{
	public string StorageKey { get; set; } = string.Empty;
	public string? Title { get; set; }
	public string? Description { get; set; }
}
