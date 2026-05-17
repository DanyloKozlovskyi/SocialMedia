namespace SocialMedia.Application.Chat.Dtos;

public class ParticipantsPageDto
{
    public List<ParticipantDto> Participants { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasMore { get; set; }
}
