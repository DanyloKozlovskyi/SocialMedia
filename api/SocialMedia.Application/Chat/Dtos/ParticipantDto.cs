namespace SocialMedia.Application.Chat.Dtos;

public class ParticipantDto
{
    public Guid UserId { get; set; }
    public string? Name { get; set; }
    public string? LogoKey { get; set; }
    public string? LogoContentType { get; set; }
}
