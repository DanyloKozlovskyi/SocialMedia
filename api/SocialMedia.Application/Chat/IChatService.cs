using SocialMedia.Application.Chat.Dtos;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Chat;

public interface IChatService
{
    Task<IEnumerable<ConversationDto>> GetConversations(Guid userId);
	Task<IEnumerable<MessageDto>> GetMessages(Guid conversationId, Guid userId, DateTime? cursor = null, int limit = 20);
	Task<Guid> StartConversation(Guid currentUserId, Guid otherUserId);
    Task<Guid> CreateGroupConversation(Guid currentUserId, string? name, List<Guid> participantIds);
    Task<MessageDto> SendMessage(Guid senderId, Guid conversationId, string? content, string? mediaKey, string? mediaContentType, string? mediaType);
    Task MarkAsRead(Guid messageId);
    Task MarkConversationAsRead(Guid conversationId, Guid userId);
}
