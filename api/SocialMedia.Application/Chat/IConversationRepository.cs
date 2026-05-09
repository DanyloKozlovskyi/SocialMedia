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
    Task RemoveParticipant(Guid conversationId, Guid userId);
    Task DeleteConversation(Guid conversationId);
    Task<(IEnumerable<ConversationParticipant> Participants, int TotalCount)> GetParticipantsPaginated(
        Guid conversationId, int skip, int take, string? searchQuery = null);
    Task SaveChangesAsync();

    // University chat methods
    Task<Conversation?> GetUniversityChat(string universityDomain);
    Task<Conversation?> GetFacultyChat(string universityDomain, string facultyCode);
    Task<Conversation?> GetMajorChat(string universityDomain, string facultyCode, string majorKey);
    Task<Conversation?> GetMajorYearChat(string universityDomain, string facultyCode, string majorKey, int yearOfStudy);
}
