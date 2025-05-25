using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Seeding.Options;
public sealed class CommentSeedOptions
{
    public string ImagesDirectory { get; set; } = default!;  
    public int CommentCount { get; set; } = 800;              
    public double ImageProbability { get; set; } = 0.25;      
}