namespace SocialMedia.Infrastructure.Persistence.Sql.Seeders.BlogPosts;
public interface IBlogPostSeeder
{
	Task SeedAsync(int targetCount = 300, CancellationToken ct = default);
}

