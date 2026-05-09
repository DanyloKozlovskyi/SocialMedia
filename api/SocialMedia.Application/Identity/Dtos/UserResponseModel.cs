namespace SocialMedia.Application.Identity.Dtos;
public class UserResponseModel
{
	public Guid? Id { get; set; }
	public string? UserName { get; set; }
	public string? Description { get; set; }
	public string? LogoKey { get; set; }
	public string? LogoContentType { get; set; }
	public string? UniversityDomain { get; set; }
	public string? FacultyCode { get; set; }
	public string? Major { get; set; }
	public string? MajorKey { get; set; }
	public int? YearOfStudy { get; set; }
}
