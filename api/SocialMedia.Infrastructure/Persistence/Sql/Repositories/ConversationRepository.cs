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

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
