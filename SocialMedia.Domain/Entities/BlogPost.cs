using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Domain.Entities;

public class BlogPost : IKeyedEntity<Guid>
{
	public Guid Id { get; set; }
	public string? Description { get; set; }
	public string? Image64 { get; set; }
	public string? ImageKey { get; set; }          // e.g. "2025/07/23/uuid.jpg"
	public string? ImageContentType { get; set; }   // optional but handy (e.g. "image/jpeg")
	public DateTime PostedAt { get; set; } = DateTime.UtcNow;
	public Guid UserId { get; set; }
	public ApplicationUser? User { get; set; }
	public virtual ICollection<Like>? Likes { get; set; }
	public Guid? ParentId { get; set; } = null; // null if it is actual post
	public BlogPost? Parent { get; set; }
	public ICollection<BlogPost> Comments { get; set; } = new List<BlogPost>();
}