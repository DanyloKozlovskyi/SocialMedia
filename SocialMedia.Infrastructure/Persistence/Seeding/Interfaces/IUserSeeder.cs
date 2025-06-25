namespace SocialMedia.Infrastructure.Persistence.Seeding.Interfaces;
public interface IUserSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}
