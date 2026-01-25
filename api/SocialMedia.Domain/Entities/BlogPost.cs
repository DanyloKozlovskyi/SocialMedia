using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Domain.Entities;

public class BlogPost : IKeyedEntity<Guid>
{
	public Guid Id { get; set; }
	public string? Description { get; set; }
	public string? ImageKey { get; set; }
	public string? ImageContentType { get; set; }
	public DateTime PostedAt { get; set; } = DateTime.UtcNow;
	public Guid UserId { get; set; }
	public ApplicationUser? User { get; set; }
	public virtual ICollection<Like>? Likes { get; set; }
	public Guid? ParentId { get; set; } = null; // null if it is actual post
	public BlogPost? Parent { get; set; }
	public ICollection<BlogPost> Comments { get; set; } = new List<BlogPost>();
}