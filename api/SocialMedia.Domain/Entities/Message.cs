using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Domain.Entities
{
    public class Message : IKeyedEntity<Guid>
    {
        public Guid Id { get; set; }
        public string? Content { get; set; }
        
        public string? MediaKey { get; set; }
        public string? MediaContentType { get; set; }
        public string? MediaType { get; set; }

        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }

        public Guid SenderId { get; set; }
        public virtual ApplicationUser Sender { get; set; } = null!;

        public Guid ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; } = null!;
    }
}
