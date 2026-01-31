using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Chat;

public interface IConversationRepository
{
    Task<IEnumerable<Conversation>> GetConversationsByUserId(Guid userId);
    Task<Conversation?> GetConversationById(Guid conversationId);
    Task<Conversation> Create(Conversation conversation);
    Task AddParticipant(ConversationParticipant participant);
    Task AddParticipants(IEnumerable<ConversationParticipant> participants);
    Task<Conversation?> GetExistingDirectConversation(Guid userId1, Guid userId2);
    Task<bool> IsParticipant(Guid conversationId, Guid userId);
    Task UpdateConversationTimestamp(Guid conversationId);
    Task SaveChangesAsync();
}
