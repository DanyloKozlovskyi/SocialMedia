using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Domain.Entities;

public class Like : IKeyedEntity<Guid>
{
	public Guid Id { get; set; }
	public Guid? UserId { get; set; }
	public ApplicationUser? User { get; set; }
	public Guid PostId { get; set; }
	public BlogPost? Post { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public bool IsLiked { get; set; } = true;
}

