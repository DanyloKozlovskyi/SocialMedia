using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Configurations;
public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
{
	public void Configure(EntityTypeBuilder<BlogPost> builder)
	{
		builder.HasKey(x => x.Id);

		builder.HasOne(x => x.User)
			   .WithMany(u => u.Posts)
			   .HasForeignKey(b => b.UserId)
			   .OnDelete(DeleteBehavior.Cascade);

		builder.HasMany(b => b.Comments)
			   .WithOne(b => b.Parent)
			   .HasForeignKey(b => b.ParentId);

		builder.HasMany(b => b.Likes)
			   .WithOne(l => l.Post)
			   .HasForeignKey(l => l.PostId);

		builder.Property(b => b.PostedAt).HasDefaultValueSql("GETUTCDATE()");

		// EF Core 8+ handles List<string> as JSON array in nvarchar(max) by default
		builder.Property(b => b.Tags)
			.HasColumnType("nvarchar(max)");
	}
}
