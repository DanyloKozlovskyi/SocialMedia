using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using SocialMedia.Application.Recommendation;
using SocialMedia.Domain;
using SocialMedia.Domain.Entities;
using System.Linq.Expressions;

namespace SocialMedia.Application.BlogPosts;
public class BlogService : IBlogService
{
	private readonly IBlogRepository _blogRepository;
	private readonly IEntityRepository<Guid, Like> _likeRepository;
	private const float CONTEXT_WEIGHT = 20;
	private const float LIKE_WEIGHT = 0.01f;
	private const float COMMENT_WEIGHT = 0.1f;
	private const float DECAY_PER_DAY_RATE = 0.001f;
	private readonly IPostRankingCache _cache;

	public BlogService(IBlogRepository repository, IEntityRepository<Guid, Like> likeRepository, IPostRankingCache cache)
	{
		_blogRepository = repository;
		_likeRepository = likeRepository;
		_cache = cache;
	}

	public async Task<BlogPost?> Create(BlogPost blogPost)
	{
		await _blogRepository.Create(blogPost);
		await _blogRepository.SaveChangesAsync();
		return blogPost;
	}
	public async Task<IEnumerable<PostResponseModel>?> GetByDescription(string description, Guid? userRequestId = null, int page = 1, int pageSize = 30)
	{
		var blogs = await _blogRepository.Get(skip: (page - 1) * pageSize, take: pageSize, whereExpression: x => x.Description.ToLower().Contains(description.ToLower()), orderBy: new Dictionary<Expression<Func<BlogPost, object>>, SortDirection>
		{
			{ x => x.Likes.Count(x => x.IsLiked) * LIKE_WEIGHT + x.Comments.Count() * COMMENT_WEIGHT, SortDirection.Descending }
		}).ToPostResponseModelQueryable(userRequestId: userRequestId).ToListAsync();

		return blogs;
	}
	public async Task<IEnumerable<PostResponseModel>?> GetParents(Guid id, Guid? userRequestId = null)
	{
		var idList = new List<Guid>();
		var cur = await _blogRepository.GetByFilterNoTracking(x => x.Id == id).FirstOrDefaultAsync();
		while (cur?.ParentId != null)
		{
			idList.Add(cur.ParentId.Value);
			cur = await _blogRepository.GetByFilterNoTracking(x => x.Id == cur.ParentId.Value).FirstOrDefaultAsync();
		}

		var postsWithUser = await _blogRepository.GetByFilterNoTracking(x => idList.Contains(x.Id), "User,Likes,Comments.User")
			.ToPostResponseModelQueryable(userRequestId)
			.ToListAsync();

		return postsWithUser.OrderBy(b => idList.IndexOf(b.Id));
	}
	public async Task<IEnumerable<PostResponseModel>> GetAll(Guid? userId = null, int page = 1, int pageSize = 30)
	{
		var baseQuery = _blogRepository.GetByFilterNoTracking(x => x.ParentId == null);

		List<Guid> postIds;

		if (userId != null)
		{
			postIds = await ComputeRecommendedPostIdsAsync(baseQuery, userId.Value, page, pageSize);
		}
		else
		{
			postIds = await _cache.GetPageFromListAsync(page, pageSize);
		}

		var posts = await _blogRepository.GetByFilterNoTracking(x => postIds.Contains(x.Id))
			.ToPostResponseModelQueryable(userRequestId: userId)
			.ToListAsync();

		var result = posts.OrderBy(x => postIds.IndexOf(x.Id));
		return result;
	}
	public async Task<PostResponseModel?> GetById(Guid id, Guid? userId = null)
	{
		return await _blogRepository.Get().ToPostResponseModelQueryable(userRequestId: userId).FirstOrDefaultAsync(x => x.Id == id);
	}
	public async Task<IEnumerable<PostResponseModel>?> GetByParentId(Guid parentId, Guid? userId = null, int page = 1, int pageSize = 30)
	{
		return await _blogRepository.Get(skip: (page - 1) * pageSize, take: pageSize, whereExpression: x => x.ParentId == parentId, orderBy: new Dictionary<Expression<Func<BlogPost, object>>, SortDirection>
		{
			{ post => post.PostedAt, SortDirection.Descending }
		}).ToPostResponseModelQueryable(userRequestId: userId).ToListAsync();
	}
	private IQueryable<BlogPost> GetPostsInChronologicalOrder(Expression<Func<BlogPost, bool>> whereExpression = null, int skip = 0, int take = 0, bool asNoTracking = false)
	{
		return _blogRepository.Get(skip: skip, take: take, whereExpression: whereExpression, orderBy: new Dictionary<Expression<Func<BlogPost, object>>, SortDirection>
		{
			{ post => post.PostedAt, SortDirection.Descending }
		}, asNoTracking: asNoTracking);
	}
	public async Task<IEnumerable<PostResponseModel>?> GetByUserId(Guid userId, Guid? userRequestId = null, int page = 1, int pageSize = 30)
	{
		return await GetPostsInChronologicalOrder(skip: (page - 1) * pageSize, take: pageSize, whereExpression: x => x.UserId == userId).ToPostResponseModelQueryable(userRequestId: userRequestId).ToListAsync();
	}

	public async Task<Like?> GetLike(Guid? postId, Guid? userId)
	{
		return await _likeRepository.GetByFilterNoTracking(x => x.PostId == postId && x.UserId == userId && x.IsLiked).FirstOrDefaultAsync();
	}

	public async Task<IEnumerable<Like>?> GetLikes(Guid? postId)
	{
		return await _likeRepository.GetByFilterNoTracking(x => x.PostId == postId && x.IsLiked).ToListAsync();
	}

	public async Task<IEnumerable<Like>?> GetUserLikes(Guid? userId, PostsRequestModel posts)
	{
		return await _likeRepository.GetByFilterNoTracking(x => x.UserId == userId && posts.PostIds.Contains(x.PostId) && x.IsLiked).ToListAsync();
	}

	public async Task<int> SetLike(Guid postId, Guid userId)
	{
		var like = await GetLike(postId, userId);

		if (like == null)
		{
			like = new Like() { Id = Guid.NewGuid(), PostId = postId, UserId = userId, IsLiked = true };
			await _likeRepository.Create(like);
		}
		else
			like.IsLiked = !like.IsLiked;

		like.CreatedAt = DateTime.UtcNow;

		await _likeRepository.SaveChangesAsync();
		var post = await GetById(postId);
		return post.LikeCount;
	}

	public float CosineSimilarity(float[] vec1, float[] vec2)
	{
		float dot = 0, magA = 0, magB = 0;
		for (int i = 0; i < vec1.Length; i++)
		{
			dot += vec1[i] * vec2[i];
			magA += vec1[i] * vec1[i];
			magB += vec2[i] * vec2[i];
		}
		return (float)(dot / (Math.Sqrt(magA) * Math.Sqrt(magB) + 1e-6)); // avoid div by 0
	}

	public async Task<List<Guid>> ComputeRecommendedPostIdsAsync(IQueryable<BlogPost> queryablePosts, Guid? userId, int page, int pageSize)
	{
		var cutoff = DateTime.UtcNow.AddDays(-60);

		var posts = await queryablePosts
			.Select(x => new PostData
			{
				Id = x.Id,
				Description = x.Description,
				Likes = x.Likes.Count(l => l.CreatedAt >= cutoff),
				Comments = x.Comments.Count(c => c.PostedAt >= cutoff),
				PostedAt = x.PostedAt
			})
			.ToListAsync();

		if (!posts.Any())
			return new List<Guid>();

		var mlContext = new MLContext();
		var data = mlContext.Data.LoadFromEnumerable(posts);
		var pipeline = mlContext.Transforms.Text.FeaturizeText("Features", nameof(PostData.Description));
		var model = pipeline.Fit(data);
		var transformedData = model.Transform(data);
		var vectors = mlContext.Data.CreateEnumerable<PostVector>(transformedData, reuseRowObject: false).ToList();

		//var userEngagedPosts = await _repository.Blogs
		//	.Where(x => x.ParentId == null &&
		//		(x.Likes.Any(l => l.UserId == userId) || x.Comments.Any(c => c.UserId == userId)))
		//	.Select(x => new PostData { Description = x.Description })
		//	.ToListAsync();

		var userEngagedPosts = await _blogRepository.GetByFilterNoTracking(x => x.ParentId == null &&
				(x.Likes.Any(l => l.UserId == userId) || x.Comments.Any(c => c.UserId == userId)))
			.Select(x => new PostData { Description = x.Description })
			.ToListAsync();

		if (!userEngagedPosts.Any())
			return posts.OrderByDescending(p => p.Id)
						.Skip((page - 1) * pageSize)
						.Take(pageSize)
						.Select(p => p.Id)
						.ToList();

		var userData = mlContext.Data.LoadFromEnumerable(userEngagedPosts);
		var userVecData = model.Transform(userData);
		var userVecs = mlContext.Data.CreateEnumerable<PostVector>(userVecData, reuseRowObject: false).ToList();

		float[] avgUserVector = new float[userVecs[0].Features.Length];
		foreach (var vec in userVecs)
			for (int i = 0; i < avgUserVector.Length; i++)
				avgUserVector[i] += vec.Features[i];

		for (int i = 0; i < avgUserVector.Length; i++)
			avgUserVector[i] /= userVecs.Count;

		var now = DateTime.UtcNow;

		var scoredPosts = posts.Select((post, i) =>
		{
			var ageInDays = (now - post.PostedAt).TotalDays;
			var decayFactor = Math.Pow(1 - DECAY_PER_DAY_RATE, ageInDays);

			//double engagement = post.Likes * likeWeight + post.Comments * commentWeight;
			//double dynamicContextWeight = 50.0 / (1.0 + engagement);

			//var baseScore = CosineSimilarity(avgUserVector, vectors[i].Features) * dynamicContextWeight
			//                + post.Likes * likeWeight
			//+ post.Comments * commentWeight;

			double engagementValue = post.Likes * LIKE_WEIGHT + post.Comments * COMMENT_WEIGHT;
			double contextWeight = Math.Log(1 + engagementValue);

			double contextScore = CosineSimilarity(avgUserVector, vectors[i].Features) * contextWeight;

			// Optionally add engagementScore if you want it to factor in independently as well:
			double finalScore = (contextScore + engagementValue) * decayFactor;


			//var finalScore = baseScore * decayFactor;

			return new
			{
				post.Id,
				Score = finalScore
			};
		})
		.OrderByDescending(p => p.Score)
		.Skip((page - 1) * pageSize)
		.Take(pageSize)
		.Select(p => p.Id)
		.ToList();

		return scoredPosts;
	}
}
