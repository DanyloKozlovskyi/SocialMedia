namespace SocialMedia.Infrastructure.Persistence.Seeders.Comments;
public interface ICommentSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}