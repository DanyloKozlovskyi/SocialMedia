namespace SocialMedia.Application.Identity.Dtos;

public class FollowResponseDto
{
	public Guid UserId { get; set; }
	public string? UserName { get; set; }
	public string? Name { get; set; }
	public string? LogoKey { get; set; }
	public string? LogoContentType { get; set; }
	public DateTime FollowedAt { get; set; }
}

public class FollowStatusDto
{
	public bool IsFollowing { get; set; }
	public int FollowersCount { get; set; }
	public int FollowingCount { get; set; }
}
