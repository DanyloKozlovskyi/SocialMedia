using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Chat;

public interface IMessageRepository
{
    Task<IEnumerable<Message>> GetMessagesByConversationId(Guid conversationId);
    Task<Message> Create(Message message);
    Task<Message?> GetById(Guid messageId);
    Task Update(Message message);
    Task SaveChangesAsync();
}
