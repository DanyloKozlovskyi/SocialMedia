namespace SocialMedia.Application.Chat.Dtos;

public class ConversationDto
{
    public Guid ConversationId { get; set; }
    public string? Name { get; set; }
    public MessageDto? LastMessage { get; set; }
    public List<ParticipantDto> Participants { get; set; } = new();
    public int UnreadCount { get; set; }
}
