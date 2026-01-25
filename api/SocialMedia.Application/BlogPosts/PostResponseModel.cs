using SocialMedia.Application.Identity.Dtos;

namespace SocialMedia.Application.BlogPosts;
public class PostResponseModel
{
	public Guid Id { get; set; }
	public string? Description { get; set; }
	public string? MediaKey { get; set; }
	public string? MediaContentType { get; set; }
	public string? MediaType { get; set; } // "image" or "video"
	public DateTime PostedAt { get; set; }
	public Guid UserId { get; set; }
	public UserResponseModel? User { get; set; }
	public int LikeCount { get; set; }
	public Guid? ParentId { get; set; }
	public List<PostResponseModel>? Comments { get; set; }
	public int CommentCount { get; set; }
	public bool IsLiked { get; set; } = false;
	public bool IsCommented { get; set; } = false;
}
