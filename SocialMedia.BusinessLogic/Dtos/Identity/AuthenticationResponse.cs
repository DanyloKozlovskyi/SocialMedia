using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.WebApi.Dtos.Identity
{
	public class AuthenticationResponse
	{
		public string? UserName { get; set; } = string.Empty;
		public string? Email { get; set; } = string.Empty;
		public string? Token { get; set; } = string.Empty;
		public DateTime Expiration { get; set; }
		public string? RefreshToken { get; set; } = string.Empty;
		public DateTime RefreshTokenExpirationDateTime { get; set; }
	}
}
