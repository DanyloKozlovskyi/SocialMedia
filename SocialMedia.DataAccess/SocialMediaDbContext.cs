using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialMedia.DataAccess.Identity;
using SocialMedia.DataAccess.Models;
using SocialMedia.DataAccess.Models.Configurations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess
{
    public class SocialMediaDbContext: IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public DbSet<BlogPost> Blogs { get; set; }
        public DbSet<Like> Likes { get; set; }
        public SocialMediaDbContext(DbContextOptions<SocialMediaDbContext> options) : base(options)
        {

        }

        public SocialMediaDbContext()
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new BlogPostConfiguration());
        }
    }
}
