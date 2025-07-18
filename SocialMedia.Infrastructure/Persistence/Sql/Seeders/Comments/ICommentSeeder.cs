namespace SocialMedia.Infrastructure.Persistence.Sql.Seeders.Comments;
public interface ICommentSeeder
{
	Task SeedAsync(CancellationToken ct = default);
}