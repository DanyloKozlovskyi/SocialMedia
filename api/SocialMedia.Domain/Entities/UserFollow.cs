using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Domain.Entities;

public class UserFollow : IKeyedEntity<Guid>
{
	public Guid Id { get; set; }
	public Guid FollowerId { get; set; }
	public ApplicationUser? Follower { get; set; }
	public Guid FollowingId { get; set; }
	public ApplicationUser? Following { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
