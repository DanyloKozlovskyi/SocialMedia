using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Seeding.Options;
public sealed class LikeSeedOptions
{
    /// <summary>Smallest number of likes given to any post.</summary>
    public int MinPerPost { get; set; } = 1;

    /// <summary>Largest number of likes given to any post.</summary>
    public int MaxPerPost { get; set; } = 20;
}