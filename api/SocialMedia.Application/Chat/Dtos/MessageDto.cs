using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Chat.Dtos;

public class MessageDto
{
    public Guid Id { get; set; }
    public string? Content { get; set; }
    
    public string? MediaKey { get; set; }
    public string? MediaContentType { get; set; }
    public string? MediaType { get; set; }

    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }

    public Guid SenderId { get; set; }
    public ParticipantDto? Sender { get; set; }

    public Guid ConversationId { get; set; }

    public static MessageDto FromEntity(Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            Content = message.Content,
            MediaKey = message.MediaKey,
            MediaContentType = message.MediaContentType,
            MediaType = message.MediaType,
            CreatedAt = message.CreatedAt,
            IsRead = message.IsRead,
            SenderId = message.SenderId,
            Sender = message.Sender != null ? new ParticipantDto
            {
                UserId = message.Sender.Id,
                Name = message.Sender.Name,
                LogoKey = message.Sender.LogoKey,
                LogoContentType = message.Sender.LogoContentType
            } : null,
            ConversationId = message.ConversationId
        };
    }
}
