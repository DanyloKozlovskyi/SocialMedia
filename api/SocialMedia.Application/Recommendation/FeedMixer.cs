namespace SocialMedia.Application.Recommendation;

public class FeedMixer : IFeedMixer
{
	private readonly SubscriptionGenerator _subscriptionGenerator;
	private readonly NlpGenerator _nlpGenerator;
	private readonly TrendingGenerator _trendingGenerator;
	private readonly ExplorationGenerator _explorationGenerator;
	private readonly CollaborativeGenerator _collaborativeGenerator;

	private const int SUBSCRIPTION_RATIO = 10;
	private const int NLP_RATIO = 8;
	private const int COLLABORATIVE_RATIO = 4;
	private const int TRENDING_RATIO = 4;
	private const int EXPLORATION_SLOTS = 4;
	private const double SCORE_JITTER = 0.1;

	public FeedMixer(
		SubscriptionGenerator subscriptionGenerator,
		NlpGenerator nlpGenerator,
		TrendingGenerator trendingGenerator,
		ExplorationGenerator explorationGenerator,
		CollaborativeGenerator collaborativeGenerator)
	{
		_subscriptionGenerator = subscriptionGenerator;
		_nlpGenerator = nlpGenerator;
		_trendingGenerator = trendingGenerator;
		_explorationGenerator = explorationGenerator;
		_collaborativeGenerator = collaborativeGenerator;
	}

	public async Task<List<Guid>> GetMixedFeedAsync(Guid userId, HashSet<Guid> excludeIds, int pageSize)
	{
		var subscriptionTask = _subscriptionGenerator.GetCandidatesAsync(userId, excludeIds, SUBSCRIPTION_RATIO * 2);
		var nlpTask = _nlpGenerator.GetCandidatesAsync(userId, excludeIds, NLP_RATIO * 2);
		var trendingTask = _trendingGenerator.GetCandidatesAsync(userId, excludeIds, TRENDING_RATIO * 2);
		var collaborativeTask = _collaborativeGenerator.GetCandidatesAsync(userId, excludeIds, COLLABORATIVE_RATIO * 2);
		var explorationTask = _explorationGenerator.GetCandidatesAsync(userId, excludeIds, EXPLORATION_SLOTS * 2);

		await Task.WhenAll(subscriptionTask, nlpTask, trendingTask, collaborativeTask, explorationTask);

		var subscriptionCandidates = subscriptionTask.Result;
		var nlpCandidates = nlpTask.Result;
		var trendingCandidates = trendingTask.Result;
		var collaborativeCandidates = collaborativeTask.Result;
		var explorationCandidates = explorationTask.Result;

		var seenIds = new HashSet<Guid>(excludeIds);
		var mainFeed = new List<Candidate>();

		TakeUnique(subscriptionCandidates, mainFeed, seenIds, SUBSCRIPTION_RATIO);
		TakeUnique(nlpCandidates, mainFeed, seenIds, NLP_RATIO);
		TakeUnique(collaborativeCandidates, mainFeed, seenIds, COLLABORATIVE_RATIO);
		TakeUnique(trendingCandidates, mainFeed, seenIds, TRENDING_RATIO);

		int mainSlots = pageSize - EXPLORATION_SLOTS;
		int remaining = mainSlots - mainFeed.Count;
		if (remaining > 0)
		{
			var allRemaining = subscriptionCandidates
				.Concat(nlpCandidates)
				.Concat(collaborativeCandidates)
				.Concat(trendingCandidates)
				.Where(c => !seenIds.Contains(c.PostId))
				.OrderByDescending(c => c.Score);

			TakeUnique(allRemaining.ToList(), mainFeed, seenIds, remaining);
		}

		ApplyScoreJitter(mainFeed);

		var explorationFeed = new List<Candidate>();
		TakeUnique(explorationCandidates, explorationFeed, seenIds, EXPLORATION_SLOTS);

		var sortedMain = mainFeed
			.OrderByDescending(c => c.Score)
			.Take(mainSlots)
			.ToList();

		var finalFeed = InterleaveFeed(sortedMain, explorationFeed, pageSize);

		return finalFeed.Select(c => c.PostId).ToList();
	}

	private static void ApplyScoreJitter(List<Candidate> candidates)
	{
		var random = Random.Shared;
		foreach (var candidate in candidates)
		{
			double jitter = 1.0 + (random.NextDouble() * SCORE_JITTER * 2 - SCORE_JITTER);
			candidate.Score *= jitter;
		}
	}

	private static List<Candidate> InterleaveFeed(List<Candidate> main, List<Candidate> exploration, int pageSize)
	{
		var result = new List<Candidate>(pageSize);

		int explorationInterval = pageSize / (exploration.Count + 1);
		if (explorationInterval < 5) explorationInterval = 5;

		int mainIndex = 0;
		int explorationIndex = 0;

		for (int i = 0; i < pageSize && (mainIndex < main.Count || explorationIndex < exploration.Count); i++)
		{
			if (explorationIndex < exploration.Count && (i + 1) % explorationInterval == 0)
			{
				result.Add(exploration[explorationIndex++]);
			}
			else if (mainIndex < main.Count)
			{
				result.Add(main[mainIndex++]);
			}
			else if (explorationIndex < exploration.Count)
			{
				result.Add(exploration[explorationIndex++]);
			}
		}

		return result;
	}

	private static int TakeUnique(List<Candidate> source, List<Candidate> destination, HashSet<Guid> seenIds, int limit)
	{
		int taken = 0;
		foreach (var candidate in source)
		{
			if (taken >= limit)
				break;

			if (seenIds.Add(candidate.PostId))
			{
				destination.Add(candidate);
				taken++;
			}
		}
		return taken;
	}
}
