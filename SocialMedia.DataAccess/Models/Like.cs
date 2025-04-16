using SocialMedia.DataAccess.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Models;
public class Like
{
    [Key]
    public Guid Id { get; set; }
    [ForeignKey(nameof(ApplicationUser))]
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    [ForeignKey(nameof(BlogPost))]
    public Guid? PostId { get; set; }
    public BlogPost? Post { get; set; }

    public bool IsLiked { get; set; } = true;
}

