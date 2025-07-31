namespace SocialMedia.Infrastructure.Persistence.Sql.Seeders.Likes;
public interface ILikeSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}
