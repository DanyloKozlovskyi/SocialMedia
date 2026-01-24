namespace SocialMedia.Infrastructure.Persistence.Sql.Seeders.Users;
public interface IUserSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}
