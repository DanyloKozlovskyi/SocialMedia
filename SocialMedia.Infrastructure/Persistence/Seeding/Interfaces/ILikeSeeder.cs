namespace SocialMedia.Infrastructure.Persistence.Seeding.Interfaces;
public interface ILikeSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}
