using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
	public void Configure(EntityTypeBuilder<Message> builder)
	{
		builder.HasKey(x => x.Id);

		builder.Property(x => x.Content).IsRequired(false).HasMaxLength(1000);
		builder.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

		builder.Property(x => x.MediaKey).IsRequired(false);
		builder.Property(x => x.MediaContentType).IsRequired(false);
		builder.Property(x => x.MediaType).IsRequired(false);

		builder.HasOne(x => x.Sender)
			   .WithMany(u => u.SentMessages)
			   .HasForeignKey(x => x.SenderId)
			   .OnDelete(DeleteBehavior.Restrict);

		builder.HasOne(x => x.Conversation)
			   .WithMany(c => c.Messages)
			   .HasForeignKey(x => x.ConversationId)
			   .OnDelete(DeleteBehavior.Cascade);
	}
}
