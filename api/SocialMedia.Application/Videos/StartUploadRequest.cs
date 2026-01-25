namespace SocialMedia.Application.Videos;

public class StartUploadRequest
{
	public string FileName { get; set; } = string.Empty;
	public long FileSize { get; set; }
	public string ContentType { get; set; } = string.Empty;
}
