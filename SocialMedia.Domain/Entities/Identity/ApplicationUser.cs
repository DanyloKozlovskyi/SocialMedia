﻿using Microsoft.AspNetCore.Identity;

namespace SocialMedia.Domain.Entities.Identity;
public class ApplicationUser : IdentityUser<Guid>
{
	public string? Name { get; set; }
	public string? RefreshToken { get; set; }
	public DateTime RefreshTokenExpirationDateTime { get; set; }
	public ICollection<BlogPost>? Posts { get; set; }
	public virtual ICollection<Like>? Likes { get; set; }
	public string? Description { get; set; }

	public string? LogoKey { get; set; }
	public string? LogoContentType { get; set; }
}
