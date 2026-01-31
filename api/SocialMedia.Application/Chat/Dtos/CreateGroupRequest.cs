namespace SocialMedia.Application.Chat.Dtos;

public class CreateGroupRequest
{
    public string? Name { get; set; }
    public List<Guid> ParticipantIds { get; set; } = new List<Guid>();
}
