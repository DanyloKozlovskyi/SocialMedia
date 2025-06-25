using Microsoft.ML.Data;

namespace SocialMedia.Application.Recommendation.Dtos;
public class PostVector
{
	[VectorType]
	public float[] Features { get; set; }
}
