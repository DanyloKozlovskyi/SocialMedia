using Microsoft.EntityFrameworkCore;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Recommendation;

public interface IRecommendationDbContext : IAsyncDisposable, IDisposable
{
	DbSet<BlogPost> Blogs { get; }
	DbSet<UserFollow> UserFollows { get; }
}

public interface IRecommendationDbContextFactory
{
	Task<IRecommendationDbContext> CreateDbContextAsync(CancellationToken cancellationToken = default);
}
