namespace SocialMedia.Infrastructure.Persistence.Seeders.Users;
public interface IUserSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}
