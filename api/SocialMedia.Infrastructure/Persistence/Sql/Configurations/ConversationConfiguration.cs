using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Configurations;

public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
	public void Configure(EntityTypeBuilder<Conversation> builder)
	{
		builder.HasKey(x => x.Id);

		builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
		builder.Property(x => x.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

		builder.HasMany(x => x.Participants)
			   .WithOne(p => p.Conversation)
			   .HasForeignKey(p => p.ConversationId)
			   .OnDelete(DeleteBehavior.Cascade);

		builder.HasMany(x => x.Messages)
			   .WithOne(m => m.Conversation)
			   .HasForeignKey(m => m.ConversationId)
			   .OnDelete(DeleteBehavior.Cascade);
	}
}
