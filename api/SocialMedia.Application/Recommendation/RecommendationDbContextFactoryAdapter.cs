using Microsoft.EntityFrameworkCore;

namespace SocialMedia.Application.Recommendation;

public class RecommendationDbContextFactoryAdapter<TContext> : IRecommendationDbContextFactory
	where TContext : DbContext, IRecommendationDbContext
{
	private readonly IDbContextFactory<TContext> _innerFactory;

	public RecommendationDbContextFactoryAdapter(IDbContextFactory<TContext> innerFactory)
	{
		_innerFactory = innerFactory;
	}

	public async Task<IRecommendationDbContext> CreateDbContextAsync(CancellationToken cancellationToken = default)
	{
		return await _innerFactory.CreateDbContextAsync(cancellationToken);
	}
}
