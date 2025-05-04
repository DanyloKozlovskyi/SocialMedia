using Microsoft.AspNetCore.Identity;
using SocialMedia.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string? Name { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpirationDateTime { get; set; }
        public ICollection<BlogPost>? Posts { get; set; }
        public virtual ICollection<Like>? Likes { get; set; }
        public string? Logo { get; set; }
        public string? Description { get; set; }
    }
}
