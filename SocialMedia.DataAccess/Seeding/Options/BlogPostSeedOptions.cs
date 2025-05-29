using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Seeding.Options;
public sealed class BlogPostSeedOptions
{
    public string ImagesDirectory { get; set; } = default!;
    public string ImagesCsvPath { get; set; } = default!;
}
