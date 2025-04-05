using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.WebApi.Dtos.Identity
{
	public class TokenModel
	{
		public string? Token { get; set; }
		public string? RefreshToken { get; set; }
	}
}
