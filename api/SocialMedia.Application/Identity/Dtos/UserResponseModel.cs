namespace SocialMedia.Application.Identity.Dtos;
public class UserResponseModel
{
	public Guid? Id { get; set; }
	public string? UserName { get; set; }
	public string? Description { get; set; }
	public string? LogoKey { get; set; }
	public string? LogoContentType { get; set; }
}
