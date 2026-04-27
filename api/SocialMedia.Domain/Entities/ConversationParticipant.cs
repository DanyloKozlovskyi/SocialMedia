using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Domain.Entities
{
    public class ConversationParticipant
    {
        public Guid ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; } = null!;

        public Guid UserId { get; set; }
        public virtual ApplicationUser User { get; set; } = null!;

        public DateTime JoinedAt { get; set; }
    }
}
