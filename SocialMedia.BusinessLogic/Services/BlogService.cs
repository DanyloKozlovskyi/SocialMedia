using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.ML;
using SocialMedia.BusinessLogic.Dtos;
using SocialMedia.BusinessLogic.Recommendation.Dtos;
using SocialMedia.BusinessLogic.Utilities;
using SocialMedia.DataAccess;
using SocialMedia.DataAccess.Models;
using SocialMedia.WebApi.Services.Interfaces;
using System.Security.Claims;

namespace SocialMedia.WebApi.Services;
public class BlogService : IBlogService
{
    SocialMediaDbContext context;
    private readonly IMapper mapper;
    private const float contextWeight = 20;
    private const float likeWeight = 0.01f;
    private const float commentWeight = 0.1f;
    private const float decayPerDayRate = 0.001f;

    public BlogService(SocialMediaDbContext dbContext, IMapper mapper)
    {
        context = dbContext;
        this.mapper = mapper;
    }

    public async Task<BlogPost?> Create(BlogPost blogPost)
    {
        await context.AddAsync(blogPost);
        await context.SaveChangesAsync();
        return blogPost;
    }
    public async Task<IEnumerable<PostResponseModel>?> GetByDescription(string description, Guid? userRequestId = null, int page=1, int pageSize = 30)
    {
        var blogs = await context.Blogs.Where(x => x.Description.ToLower().Contains(description.ToLower())).OrderByDescending(x => (x.Likes.Count() * 0.1) + x.Comments.Count()).Skip((page - 1) * pageSize).Take(pageSize).ToPostResponseModelQueryable(userRequestId: userRequestId).ToListAsync();
        return blogs;
    }
    public async Task<IEnumerable<PostResponseModel>?> GetParents(Guid id, Guid? userRequestId = null)
    {
        var idList = new List<Guid>();
        var cur = await context.Blogs.FindAsync(id);
        while (cur?.ParentId != null)
        {
            idList.Add(cur.ParentId.Value);
            cur = await context.Blogs.FindAsync(cur.ParentId.Value);
        }

        var postsWithUser = await context.Blogs
            .Where(b => idList.Contains(b.Id))
            .Include(b => b.User)
            .Include(b => b.Likes)
            .Include(b => b.Comments).ThenInclude(c => c.User)
            .ToPostResponseModelQueryable(userRequestId)
            .ToListAsync();

        return postsWithUser.OrderBy(b => idList.IndexOf(b.Id));
    }
    public async Task<IEnumerable<PostResponseModel>> GetAll(Guid? userId = null, int page = 1, int pageSize = 30)
    {
        var baseQuery = context.Blogs.Where(x => x.ParentId == null);

        List<Guid> postIds;

        if (userId != null)
        {
            // Use recommendation system for personalized results
            postIds = await ComputeRecommendedPostIdsAsync(
                baseQuery, userId.Value, page, pageSize);
        }
        else
        {
            var now = DateTime.UtcNow;

            var scoredPosts = await baseQuery
                .Select(x => new
                {
                    x.Id,
                    x.Likes,
                    x.Comments,
                    x.PostedAt
                })
                .ToListAsync();

            postIds = scoredPosts.Select(p =>
                {
                    var ageInDays = (now - p.PostedAt).TotalDays;
                    var decayFactor = Math.Pow(1 - decayPerDayRate, ageInDays);

                    var score = (p.Likes.Count * likeWeight + p.Comments.Count * commentWeight) * decayFactor;

                    return new { p.Id, Score = score };
                })
                .OrderByDescending(p => p.Score)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => p.Id)
                .ToList();
        }

        var posts = await context.Blogs
            .Where(x => postIds.Contains(x.Id))
            .ToPostResponseModelQueryable(userRequestId: userId)
            .ToListAsync();

        return posts.OrderBy(x => postIds.IndexOf(x.Id));
    }
    public async Task<PostResponseModel?> GetById(Guid id, Guid? userId = null)
    {
        return await context.Blogs.ToPostResponseModelQueryable(userRequestId: userId).FirstOrDefaultAsync(x => x.Id == id);
    }
    public async Task<IEnumerable<PostResponseModel>?> GetByParentId(Guid parentId, Guid? userId = null, int page = 1, int pageSize = 30)
    {
        return await context.Blogs.Where(x => x.ParentId == parentId).OrderByDescending(x => x.PostedAt).Skip((page - 1) * pageSize).Take(pageSize).ToPostResponseModelQueryable(userRequestId: userId).ToListAsync();
    }

    public async Task<IEnumerable<PostResponseModel>?> GetByUserId(Guid userId, Guid? userRequestId = null, int page = 1, int pageSize = 30)
    {
        return await context.Blogs.Where(x => x.UserId == userId).OrderByDescending(x => x.PostedAt).Skip((page - 1) * pageSize).Take(pageSize).ToPostResponseModelQueryable(userRequestId: userRequestId).ToListAsync();
    }

    public async Task<Like?> GetLike(Guid? postId, Guid? userId)
    {
        return await context.Likes.Where(x => x.PostId == postId && x.UserId == userId && x.IsLiked).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Like>?> GetLikes(Guid? postId)
    {
        return await context.Likes.Where(x => x.PostId == postId && x.IsLiked).ToListAsync();
    }

    public async Task<IEnumerable<Like>?> GetUserLikes(Guid? userId, PostsRequestModel posts)
    {
        return await context.Likes.Where(x => x.UserId == userId && posts.PostIds.Contains(x.PostId) && x.IsLiked).ToListAsync();
    }

    public async Task<int> SetLike(Guid postId, Guid userId)
    {
        var like = await GetLike(postId, userId);

        if (like == null)
        {
            like = new Like() { Id = Guid.NewGuid(), PostId = postId, UserId = userId, IsLiked = true };
            await context.Likes.AddAsync(like);
        }
        else
            like.IsLiked = !like.IsLiked;

        like.CreatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();
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

        var userEngagedPosts = await context.Blogs
            .Where(x => x.ParentId == null &&
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
            var decayFactor = Math.Pow(1 - decayPerDayRate, ageInDays);

            //double engagement = post.Likes * likeWeight + post.Comments * commentWeight;
            //double dynamicContextWeight = 50.0 / (1.0 + engagement);

            //var baseScore = CosineSimilarity(avgUserVector, vectors[i].Features) * dynamicContextWeight
            //                + post.Likes * likeWeight
            //+ post.Comments * commentWeight;

            double engagementValue = post.Likes * likeWeight + post.Comments * commentWeight;
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
