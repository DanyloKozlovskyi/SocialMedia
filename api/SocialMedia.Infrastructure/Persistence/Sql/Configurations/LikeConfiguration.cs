using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Configurations;
public class LikeConfiguration : IEntityTypeConfiguration<Like>
{
	public void Configure(EntityTypeBuilder<Like> builder)
	{
		builder.HasKey(x => x.Id);

		builder.HasOne(x => x.User)
			   .WithMany(u => u.Likes)
			   .HasForeignKey(b => b.UserId)
			   .OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(b => b.Post)
			   .WithMany(b => b.Likes)
			   .HasForeignKey(b => b.PostId);

		builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()").IsRequired();
	}
}
