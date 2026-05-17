using Microsoft.EntityFrameworkCore;
using SocialMedia.Application.Chat;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly SocialMediaDbContext _context;

    public ConversationRepository(SocialMediaDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Conversation>> GetConversationsByUserId(Guid userId)
    {
        return await _context.ConversationParticipants
            .Where(cp => cp.UserId == userId)
            .Include(cp => cp.Conversation)
                .ThenInclude(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
            .Include(cp => cp.Conversation)
                .ThenInclude(c => c.Participants)
                    .ThenInclude(p => p.User)
            .Select(cp => cp.Conversation)
            .ToListAsync();
    }

    public async Task<Conversation?> GetConversationById(Guid conversationId)
    {
        return await _context.Conversations
            .Include(c => c.Participants)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(c => c.Id == conversationId);
    }

    public async Task<Conversation> Create(Conversation conversation)
    {
        _context.Conversations.Add(conversation);
        return conversation;
    }

    public async Task AddParticipant(ConversationParticipant participant)
    {
        _context.ConversationParticipants.Add(participant);
        await Task.CompletedTask;
    }

    public async Task AddParticipants(IEnumerable<ConversationParticipant> participants)
    {
        _context.ConversationParticipants.AddRange(participants);
        await Task.CompletedTask;
    }

    public async Task<Conversation?> GetExistingDirectConversation(Guid userId1, Guid userId2)
    {
        return await _context.ConversationParticipants
            .Where(cp => cp.UserId == userId1)
            .Select(cp => cp.Conversation)
            .Where(c => c.Participants.Count == 2 && 
                       c.Participants.Any(p => p.UserId == userId2))
            .FirstOrDefaultAsync();
    }

    public async Task<bool> IsParticipant(Guid conversationId, Guid userId)
    {
        return await _context.ConversationParticipants
            .AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId);
    }

    public async Task UpdateConversationTimestamp(Guid conversationId)
    {
        var conversation = await _context.Conversations.FindAsync(conversationId);
        if (conversation != null)
        {
            conversation.UpdatedAt = DateTime.UtcNow;
        }
    }

    public async Task RemoveParticipant(Guid conversationId, Guid userId)
    {
        var participant = await _context.ConversationParticipants
            .FirstOrDefaultAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId);
        
        if (participant != null)
        {
            _context.ConversationParticipants.Remove(participant);
        }
    }

    public async Task DeleteConversation(Guid conversationId)
    {
        var conversation = await _context.Conversations
            .Include(c => c.Messages)
            .Include(c => c.Participants)
            .FirstOrDefaultAsync(c => c.Id == conversationId);

        if (conversation != null)
        {
            _context.Messages.RemoveRange(conversation.Messages);
            _context.ConversationParticipants.RemoveRange(conversation.Participants);
            _context.Conversations.Remove(conversation);
        }
    }

    public async Task<(IEnumerable<ConversationParticipant> Participants, int TotalCount)> GetParticipantsPaginated(
        Guid conversationId, int skip, int take, string? searchQuery = null)
    {
        IQueryable<ConversationParticipant> query = _context.ConversationParticipants
            .Where(cp => cp.ConversationId == conversationId)
            .Include(cp => cp.User);

        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            var lowerQuery = searchQuery.ToLower();
            query = query.Where(cp => cp.User != null && 
                (cp.User.Name != null && cp.User.Name.ToLower().Contains(lowerQuery) ||
                 cp.User.UserName != null && cp.User.UserName.ToLower().Contains(lowerQuery)));
        }

        var totalCount = await query.CountAsync();
        var participants = await query
            .OrderBy(cp => cp.User!.Name)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return (participants, totalCount);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<Conversation?> GetUniversityChat(string universityDomain)
    {
        return await _context.Conversations
            .FirstOrDefaultAsync(c => c.Type == ConversationType.University &&
                                      c.UniversityDomain == universityDomain);
    }

    public async Task<Conversation?> GetFacultyChat(string universityDomain, string facultyCode)
    {
        return await _context.Conversations
            .FirstOrDefaultAsync(c => c.Type == ConversationType.Faculty &&
                                      c.UniversityDomain == universityDomain &&
                                      c.FacultyCode == facultyCode);
    }

    public async Task<Conversation?> GetMajorChat(string universityDomain, string facultyCode, string majorKey)
    {
        return await _context.Conversations
            .FirstOrDefaultAsync(c => c.Type == ConversationType.Major &&
                                      c.UniversityDomain == universityDomain &&
                                      c.FacultyCode == facultyCode &&
                                      c.MajorKey == majorKey);
    }

    public async Task<Conversation?> GetMajorYearChat(string universityDomain, string facultyCode, string majorKey, int yearOfStudy)
    {
        return await _context.Conversations
            .FirstOrDefaultAsync(c => c.Type == ConversationType.MajorYear &&
                                      c.UniversityDomain == universityDomain &&
                                      c.FacultyCode == facultyCode &&
                                      c.MajorKey == majorKey &&
                                      c.YearOfStudy == yearOfStudy);
    }
}
