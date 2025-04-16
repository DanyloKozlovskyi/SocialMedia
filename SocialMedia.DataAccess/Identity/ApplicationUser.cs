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
        public IEnumerable<BlogPost>? Posts { get; set; }
        public virtual IEnumerable<Like>? Likes { get; set; }
    }
}
