using Microsoft.EntityFrameworkCore;
using SocialMedia.BusinessLogic.Dtos;
using SocialMedia.DataAccess;
using SocialMedia.DataAccess.Models;
using SocialMedia.WebApi.Services.Interfaces;

namespace SocialMedia.WebApi.Services
{
    public class BlogService : IBlogService
    {
        SocialMediaDbContext context;
        public BlogService(SocialMediaDbContext dbContext)
        {
            context = dbContext;
        }

        public async Task<BlogPost?> Create(BlogPost blogPost)
        {
            await context.AddAsync(blogPost);
            await context.SaveChangesAsync();
            return blogPost;
        }

        public async Task<IEnumerable<BlogPost>?> GetAll()
        {
            return await context.Blogs.ToListAsync();
        }

        public async Task<BlogPost?> GetById(Guid id)
        {
            return await context.Blogs.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<BlogPost>?> GetByUserId(Guid userId)
        {
            return await context.Blogs.Where(x => x.UserId == userId).ToListAsync();
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

        public async Task<Like?> SetLike(Guid postId, Guid userId)
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
            return like;
        }
    }
}
