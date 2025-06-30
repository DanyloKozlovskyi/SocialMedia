namespace SocialMedia.Infrastructure.Persistence.Seeders.Likes;
public sealed class LikeSeedOptions
{
	public int MinPerPost { get; set; } = 1;
	public int MaxPerPost { get; set; } = 20;
}