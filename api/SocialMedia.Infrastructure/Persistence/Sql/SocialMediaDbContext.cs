using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialMedia.Domain.Entities;
using SocialMedia.Domain.Entities.Identity;
using SocialMedia.Infrastructure.Persistence.Sql.Configurations;

namespace SocialMedia.Infrastructure.Persistence.Sql
{
	public class SocialMediaDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
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
