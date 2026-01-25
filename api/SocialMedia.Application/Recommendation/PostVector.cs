using Microsoft.ML.Data;

namespace SocialMedia.Application.Recommendation;
public class PostVector
{
	[VectorType]
	public float[] Features { get; set; }
}
