using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SocialMedia.BusinessLogic.Dtos;
using SocialMedia.BusinessLogic.Utilities;
using SocialMedia.DataAccess;
using SocialMedia.DataAccess.Models;
using SocialMedia.WebApi.Services.Interfaces;
using System.Security.Claims;

namespace SocialMedia.WebApi.Services
{
    public class BlogService : IBlogService
    {
        SocialMediaDbContext context;
        private readonly IMapper mapper;
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
        public async Task<IEnumerable<PostResponseModel>?> GetByDescription(string description, Guid? userRequestId = null)
        {
            var blogs = await context.Blogs.Where(u => u.Description.ToLower().Contains(description.ToLower())).ToPostResponseModelQueryable(userRequestId: userRequestId).ToListAsync();
            return blogs;
        }

        public async Task<IEnumerable<PostResponseModel>?> GetAll(Guid? userId = null)
        {
            return await context.Blogs.Where(x => x.ParentId == null).ToPostResponseModelQueryable(userRequestId: userId).ToListAsync();
        }
        public async Task<PostResponseModel?> GetById(Guid id, Guid? userId = null)
        {
            return await context.Blogs.ToPostResponseModelQueryable(userRequestId: userId).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<IEnumerable<PostResponseModel>?> GetByParentId(Guid parentId, Guid? userId = null)
        {
            return await context.Blogs.Where(x => x.ParentId == parentId).ToPostResponseModelQueryable(userRequestId: userId).ToListAsync();
        }

        public async Task<IEnumerable<PostResponseModel>?> GetByUserId(Guid userId, Guid? userRequestId = null)
        {
            return await context.Blogs.Where(x => x.UserId == userId).ToPostResponseModelQueryable(userRequestId: userRequestId).ToListAsync();
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

            await context.SaveChangesAsync();
            var post = await GetById(postId);
            return post.LikeCount;
        }
    }
}
