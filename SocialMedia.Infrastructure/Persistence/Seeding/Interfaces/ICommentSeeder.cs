namespace SocialMedia.Infrastructure.Persistence.Seeding.Interfaces;
public interface ICommentSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}