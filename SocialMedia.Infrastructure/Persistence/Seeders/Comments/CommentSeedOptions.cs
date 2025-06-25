namespace SocialMedia.Infrastructure.Persistence.Seeders.Comments;
public sealed class CommentSeedOptions
{
	public string ImagesDirectory { get; set; } = default!;
	public int CommentCount { get; set; } = 800;
	public double ImageProbability { get; set; } = 0.25;
}