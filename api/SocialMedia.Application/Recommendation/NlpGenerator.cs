using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using SocialMedia.Application.BlogPosts;

namespace SocialMedia.Application.Recommendation;

public class NlpGenerator : ICandidateGenerator
{
	private readonly IBlogRepository _blogRepository;

	public CandidateSource Source => CandidateSource.Nlp;

	public NlpGenerator(IBlogRepository blogRepository)
	{
		_blogRepository = blogRepository;
	}

	public async Task<List<Candidate>> GetCandidatesAsync(Guid userId, HashSet<Guid> excludeIds, int limit)
	{
		var cutoff = DateTime.UtcNow.AddDays(-60);

		var posts = await _blogRepository
			.GetByFilterNoTracking(x => x.ParentId == null && !excludeIds.Contains(x.Id))
			.Select(x => new PostData
			{
				Id = x.Id,
				UserId = x.UserId,
				Description = x.Description,
				Likes = x.Likes.Count(l => l.CreatedAt >= cutoff),
				Comments = x.Comments.Count(c => c.PostedAt >= cutoff),
				PostedAt = x.PostedAt
			})
			.ToListAsync();

		if (!posts.Any())
			return new List<Candidate>();

		var userEngagedPosts = await _blogRepository
			.GetByFilterNoTracking(x => x.ParentId == null &&
				(x.Likes.Any(l => l.UserId == userId) || x.Comments.Any(c => c.UserId == userId)))
			.Select(x => new PostData { Description = x.Description })
			.ToListAsync();

		if (!userEngagedPosts.Any())
		{
			return posts
				.OrderByDescending(p => p.PostedAt)
				.Take(limit)
				.Select(p => new Candidate
				{
					PostId = p.Id,
					AuthorId = p.UserId,
					Score = 0.5,
					Source = CandidateSource.Nlp
				})
				.ToList();
		}

		var mlContext = new MLContext();
		var data = mlContext.Data.LoadFromEnumerable(posts);
		var pipeline = mlContext.Transforms.Text.FeaturizeText("Features", nameof(PostData.Description));
		var model = pipeline.Fit(data);
		var transformedData = model.Transform(data);
		var vectors = mlContext.Data.CreateEnumerable<PostVector>(transformedData, reuseRowObject: false).ToList();

		var userData = mlContext.Data.LoadFromEnumerable(userEngagedPosts);
		var userVecData = model.Transform(userData);
		var userVecs = mlContext.Data.CreateEnumerable<PostVector>(userVecData, reuseRowObject: false).ToList();

		float[] avgUserVector = new float[userVecs[0].Features.Length];
		foreach (var vec in userVecs)
			for (int i = 0; i < avgUserVector.Length; i++)
				avgUserVector[i] += vec.Features[i];

		for (int i = 0; i < avgUserVector.Length; i++)
			avgUserVector[i] /= userVecs.Count;

		var candidates = posts
			.Select((post, i) =>
			{
				float cosineSim = CosineSimilarity(avgUserVector, vectors[i].Features);
				double score = Math.Clamp((cosineSim + 1.0) / 2.0, 0.0, 1.0);

				return new Candidate
				{
					PostId = post.Id,
					AuthorId = post.UserId,
					Score = score,
					Source = CandidateSource.Nlp
				};
			})
			.OrderByDescending(c => c.Score)
			.Take(limit)
			.ToList();

		return candidates;
	}

	private static float CosineSimilarity(float[] vec1, float[] vec2)
	{
		float dot = 0, magA = 0, magB = 0;
		for (int i = 0; i < vec1.Length; i++)
		{
			dot += vec1[i] * vec2[i];
			magA += vec1[i] * vec1[i];
			magB += vec2[i] * vec2[i];
		}
		return (float)(dot / (Math.Sqrt(magA) * Math.Sqrt(magB) + 1e-6));
	}
}
