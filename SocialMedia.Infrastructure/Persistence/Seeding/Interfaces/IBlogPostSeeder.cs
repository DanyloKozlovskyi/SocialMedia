namespace SocialMedia.Infrastructure.Persistence.Seeding.Interfaces;
public interface IBlogPostSeeder
{
	Task SeedAsync(int targetCount = 300, CancellationToken ct = default);
}

