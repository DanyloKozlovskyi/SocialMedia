using Microsoft.ML.Data;

namespace SocialMedia.Application.Recommendation;
public class PostData
{
	[NoColumn]
	public Guid Id { get; set; }
	public string Description { get; set; }
	public int Likes { get; set; }
	public int Comments { get; set; }
	[NoColumn]
	public DateTime PostedAt { get; set; }
}
