namespace SocialMedia.Application.Identity.Dtos;

public class UpdateUniversityInfoDto
{
	public string? UniversityDomain { get; set; }
	public string? UniversityName { get; set; }
	public string? FacultyCode { get; set; }
	public string? FacultyName { get; set; }
	public string? Major { get; set; }
	public string? MajorKey { get; set; }
	public int? YearOfStudy { get; set; }
	public string? AcademicRole { get; set; }
}
