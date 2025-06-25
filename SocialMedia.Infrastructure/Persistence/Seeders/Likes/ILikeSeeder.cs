namespace SocialMedia.Infrastructure.Persistence.Seeders.Likes;
public interface ILikeSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}
