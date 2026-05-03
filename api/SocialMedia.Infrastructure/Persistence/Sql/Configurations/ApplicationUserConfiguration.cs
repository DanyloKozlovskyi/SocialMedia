using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Infrastructure.Persistence.Sql.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
	public void Configure(EntityTypeBuilder<ApplicationUser> builder)
	{
		// EF Core 8+ handles List<string> as JSON array in nvarchar(max) by default
		builder.Property(u => u.Interests)
			.HasColumnType("nvarchar(max)");
	}
}
