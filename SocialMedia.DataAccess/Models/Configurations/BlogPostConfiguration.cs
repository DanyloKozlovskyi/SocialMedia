using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Models.Configurations
{
    public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
    {
        public void Configure(EntityTypeBuilder<BlogPost> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.User).WithMany(x => x.Posts);
            builder.HasMany(x => x.Likes).WithOne(x => x.Post);
            builder.HasOne(x => x.Parent).WithMany(x => x.Comments);
            builder.Property(b => b.PostedAt).HasDefaultValueSql("GETUTCDATE()");
        }
    }
}
