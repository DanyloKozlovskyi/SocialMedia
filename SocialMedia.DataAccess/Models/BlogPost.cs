using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SocialMedia.DataAccess.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Models;
public class BlogPost
{
    [Key]
    public Guid Id { get; set; }
    public string? Description { get; set; }
    public string? Image64 { get; set; }
    public DateTime PostedAt { get; set; }
    [ForeignKey(nameof(ApplicationUser))]
    public Guid UserId { get; set; }
    public virtual ApplicationUser? User { get; set; }
    public virtual ICollection<Like>? Likes { get; set; }
    public Guid? ParentId { get; set; } = null; // null if it is actual post
    [ForeignKey(nameof(ParentId))]
    public BlogPost? Parent { get; set; }
    public ICollection<BlogPost> Comments { get; set; } = new List<BlogPost>();
}