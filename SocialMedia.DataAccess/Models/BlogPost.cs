using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SocialMedia.DataAccess.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Models
{
    public class BlogPost
    {
        [Key]
        public Guid Id { get; set; }
        public string? Label { get; set; }
        public string? Image64 { get; set; }
        public DateTime PostedAt { get; set; }
        [ForeignKey(nameof(ApplicationUser))]
        public Guid UserId { get; set; }
        public virtual ApplicationUser? User { get; set; }
    }
}
