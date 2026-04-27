using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Configurations;

public class UserFollowConfiguration : IEntityTypeConfiguration<UserFollow>
{
	public void Configure(EntityTypeBuilder<UserFollow> builder)
	{
		builder.HasKey(x => x.Id);

		builder.HasIndex(x => new { x.FollowerId, x.FollowingId }).IsUnique();

		builder.HasOne(x => x.Follower)
			   .WithMany(u => u.Following)
			   .HasForeignKey(x => x.FollowerId)
			   .OnDelete(DeleteBehavior.Restrict);

		builder.HasOne(x => x.Following)
			   .WithMany(u => u.Followers)
			   .HasForeignKey(x => x.FollowingId)
			   .OnDelete(DeleteBehavior.Restrict);

		builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()").IsRequired();
	}
}
