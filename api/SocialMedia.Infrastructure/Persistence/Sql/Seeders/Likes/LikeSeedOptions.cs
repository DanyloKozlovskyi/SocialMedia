namespace SocialMedia.Infrastructure.Persistence.Sql.Seeders.Likes;
public sealed class LikeSeedOptions
{
	public int MinPerPost { get; set; } = 1;
	public int MaxPerPost { get; set; } = 20;
}