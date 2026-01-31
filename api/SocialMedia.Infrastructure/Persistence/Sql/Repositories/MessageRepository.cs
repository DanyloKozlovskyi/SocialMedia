using Microsoft.EntityFrameworkCore;
using SocialMedia.Application.Chat;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly SocialMediaDbContext _context;

    public MessageRepository(SocialMediaDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Message>> GetMessagesByConversationId(Guid conversationId)
    {
        return await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.CreatedAt)
            .Include(m => m.Sender)
            .ToListAsync();
    }

    public async Task<Message> Create(Message message)
    {
        _context.Messages.Add(message);
        return message;
    }

    public async Task<Message?> GetById(Guid messageId)
    {
        return await _context.Messages.FindAsync(messageId);
    }

    public async Task Update(Message message)
    {
        _context.Entry(message).State = EntityState.Modified;
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
