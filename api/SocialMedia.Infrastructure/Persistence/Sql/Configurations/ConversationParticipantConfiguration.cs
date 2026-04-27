using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Infrastructure.Persistence.Sql.Configurations;

public class ConversationParticipantConfiguration : IEntityTypeConfiguration<ConversationParticipant>
{
	public void Configure(EntityTypeBuilder<ConversationParticipant> builder)
	{
		builder.HasKey(x => new { x.ConversationId, x.UserId });

		builder.Property(x => x.JoinedAt).HasDefaultValueSql("GETUTCDATE()");

		builder.HasOne(x => x.Conversation)
			   .WithMany(c => c.Participants)
			   .HasForeignKey(x => x.ConversationId)
			   .OnDelete(DeleteBehavior.Cascade);

		builder.HasOne(x => x.User)
			   .WithMany(u => u.ConversationParticipants)
			   .HasForeignKey(x => x.UserId)
			   .OnDelete(DeleteBehavior.Cascade);
	}
}
