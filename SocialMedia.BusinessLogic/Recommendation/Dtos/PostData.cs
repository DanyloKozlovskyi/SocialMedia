using Microsoft.ML.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.BusinessLogic.Recommendation.Dtos;
public class PostData
{
    [NoColumn]
    public Guid Id { get; set; }
    public string Description { get; set; }
    public int Likes { get; set; }
    public int Comments { get; set; }
    [NoColumn]
    public DateTime PostedAt { get; set; }
}
