﻿namespace SocialMedia.Application.Identity.Dtos;
public class AuthenticationResponse
{
	public string? UserName { get; set; } = string.Empty;
	public string? Email { get; set; } = string.Empty;
	public string? Token { get; set; } = string.Empty;
	public DateTime Expiration { get; set; }
	public string? RefreshToken { get; set; } = string.Empty;
	public DateTime RefreshTokenExpirationDateTime { get; set; }
}
