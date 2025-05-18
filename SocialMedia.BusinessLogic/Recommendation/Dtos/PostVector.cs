using Microsoft.ML.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.BusinessLogic.Recommendation.Dtos;
public class PostVector
{
    [VectorType]
    public float[] Features { get; set; }
}
