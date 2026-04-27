using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using Microsoft.ML.Trainers;
using SocialMedia.Application.BlogPosts;

namespace SocialMedia.Application.Recommendation;

public class CollaborativeGenerator : ICandidateGenerator
{
	private readonly IBlogRepository _blogRepository;
	private static ITransformer? _cachedModel;
	private static DateTime _modelTrainedAt = DateTime.MinValue;
	private static readonly object _modelLock = new();
	private const int MODEL_CACHE_HOURS = 6;

	public CandidateSource Source => CandidateSource.Collaborative;

	public CollaborativeGenerator(IBlogRepository blogRepository)
	{
		_blogRepository = blogRepository;
	}

	public async Task<List<Candidate>> GetCandidatesAsync(Guid userId, HashSet<Guid> excludeIds, int limit)
	{
		var cutoff = DateTime.UtcNow.AddDays(-60);

		var interactions = await _blogRepository
			.GetByFilterNoTracking(x => x.ParentId == null)
			.SelectMany(p => p.Likes
				.Where(l => l.IsLiked && l.CreatedAt >= cutoff)
				.Select(l => new UserPostInteraction
				{
					UserId = l.UserId.GetHashCode(),
					PostId = p.Id.GetHashCode(),
					Label = 1.0f
				})
				.Concat(p.Comments
					.Where(c => c.PostedAt >= cutoff)
					.Select(c => new UserPostInteraction
					{
						UserId = c.UserId.GetHashCode(),
						PostId = p.Id.GetHashCode(),
						Label = 2.0f
					})))
			.ToListAsync();

		if (interactions.Count < 50)
			return new List<Candidate>();

		var model = GetOrTrainModel(interactions);
		if (model == null)
			return new List<Candidate>();

		var candidatePosts = await _blogRepository
			.GetByFilterNoTracking(x => x.ParentId == null && !excludeIds.Contains(x.Id))
			.OrderByDescending(x => x.PostedAt)
			.Take(limit * 5)
			.Select(x => new { x.Id, x.UserId })
			.ToListAsync();

		if (candidatePosts.Count == 0)
			return new List<Candidate>();

		var mlContext = new MLContext();
		var predictionEngine = mlContext.Model.CreatePredictionEngine<UserPostInteraction, InteractionPrediction>(model);

		var userIdHash = userId.GetHashCode();
		var scored = candidatePosts
			.Select(p =>
			{
				var prediction = predictionEngine.Predict(new UserPostInteraction
				{
					UserId = userIdHash,
					PostId = p.Id.GetHashCode()
				});

				return new Candidate
				{
					PostId = p.Id,
					AuthorId = p.UserId,
					Score = Math.Clamp(prediction.Score / 2.0, 0.0, 1.0),
					Source = CandidateSource.Collaborative
				};
			})
			.OrderByDescending(c => c.Score)
			.Take(limit)
			.ToList();

		return scored;
	}

	private static ITransformer? GetOrTrainModel(List<UserPostInteraction> interactions)
	{
		lock (_modelLock)
		{
			if (_cachedModel != null && DateTime.UtcNow - _modelTrainedAt < TimeSpan.FromHours(MODEL_CACHE_HOURS))
				return _cachedModel;

			try
			{
				var mlContext = new MLContext();
				var data = mlContext.Data.LoadFromEnumerable(interactions);

				var options = new MatrixFactorizationTrainer.Options
				{
					MatrixColumnIndexColumnName = nameof(UserPostInteraction.UserId),
					MatrixRowIndexColumnName = nameof(UserPostInteraction.PostId),
					LabelColumnName = nameof(UserPostInteraction.Label),
					NumberOfIterations = 20,
					ApproximationRank = 32
				};

				var pipeline = mlContext.Recommendation().Trainers.MatrixFactorization(options);
				_cachedModel = pipeline.Fit(data);
				_modelTrainedAt = DateTime.UtcNow;

				return _cachedModel;
			}
			catch
			{
				return null;
			}
		}
	}
}

public class UserPostInteraction
{
	public int UserId { get; set; }
	public int PostId { get; set; }
	public float Label { get; set; }
}

public class InteractionPrediction
{
	public float Score { get; set; }
}
