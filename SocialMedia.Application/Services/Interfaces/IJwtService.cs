using SocialMedia.Application.Dtos.Identity;
using SocialMedia.Domain.Entities.Identity;
using System.Security.Claims;

namespace SocialMedia.Application.Services.Interfaces;
public interface IJwtService
{
	AuthenticationResponse CreateJwtToken(ApplicationUser user);
	ClaimsPrincipal? GetPrincipalFromJwtToken(string? token);
}
