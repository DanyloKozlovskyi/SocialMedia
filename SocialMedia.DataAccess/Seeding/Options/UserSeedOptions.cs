using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Seeding.Options;
public sealed class UserSeedOptions
{
    /// <summary>Absolute directory that contains labels.csv and the avatar images.</summary>
    public string AvatarsDirectory { get; set; } = default!;
}