namespace SocialMedia.Infrastructure.Persistence.Seeding.Options;
public sealed class LikeSeedOptions
{
	public int MinPerPost { get; set; } = 1;
	public int MaxPerPost { get; set; } = 20;
}