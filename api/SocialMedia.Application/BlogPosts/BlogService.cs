using Microsoft.EntityFrameworkCore;
using SocialMedia.Application.Recommendation;
using SocialMedia.Domain;
using SocialMedia.Domain.Entities;
using System.Linq.Expressions;

namespace SocialMedia.Application.BlogPosts;
public class BlogService : IBlogService
{
	private readonly IBlogRepository _blogRepository;
	private readonly IEntityRepository<Guid, Like> _likeRepository;
	private readonly IPostRankingCache _cache;
	private readonly IImpressionTracker _impressionTracker;
	private readonly IFeedMixer _feedMixer;

	private const float LIKE_WEIGHT = 0.01f;
	private const float COMMENT_WEIGHT = 0.1f;

	public BlogService(IBlogRepository repository, IEntityRepository<Guid, Like> likeRepository, IPostRankingCache cache, IImpressionTracker impressionTracker, IFeedMixer feedMixer)
	{
		_blogRepository = repository;
		_likeRepository = likeRepository;
		_cache = cache;
		_impressionTracker = impressionTracker;
		_feedMixer = feedMixer;
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
		HashSet<Guid> impressionIds = userId.HasValue
			? await _impressionTracker.GetImpressionsAsync(userId.Value)
			: new HashSet<Guid>();

		List<Guid> postIds;

		if (userId.HasValue)
		{
			postIds = await _feedMixer.GetMixedFeedAsync(userId.Value, impressionIds, pageSize);
		}
		else
		{
			postIds = await _cache.GetPageFromListAsync(page, pageSize);
		}

		var posts = await _blogRepository.GetByFilterNoTracking(x => postIds.Contains(x.Id))
			.ToPostResponseModelQueryable(userRequestId: userId)
			.ToListAsync();

		var result = posts.OrderBy(x => postIds.IndexOf(x.Id));

		if (userId.HasValue && postIds.Count > 0)
		{
			await _impressionTracker.LogImpressionsAsync(userId.Value, postIds);
		}

		return result;
	}
	public async Task<PostResponseModel?> GetById(Guid id, Guid? userId = null)
	{
		return await _blogRepository
			.Get(whereExpression: x => x.Id == id, asNoTracking: true)
			.Where(p => p.Id == id)
			.ToPostResponseModelQueryable(userId)
			.FirstOrDefaultAsync();
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
		return await _likeRepository.Get(whereExpression: x => x.PostId == postId && x.UserId == userId && x.IsLiked).FirstOrDefaultAsync();
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
}
