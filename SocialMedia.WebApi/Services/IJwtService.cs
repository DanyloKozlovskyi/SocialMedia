using SocialMedia.WebApi.Dtos.Identity;
using SocialMedia.DataAccess.Identity;
using System.Security.Claims;

namespace SocialMedia.WebApi.Services
{
	public interface IJwtService
	{
		AuthenticationResponse CreateJwtToken(ApplicationUser user);
		ClaimsPrincipal? GetPrincipalFromJwtToken(string? token);
	}
}
