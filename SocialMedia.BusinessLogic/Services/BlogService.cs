using Microsoft.EntityFrameworkCore;
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
    }
}
