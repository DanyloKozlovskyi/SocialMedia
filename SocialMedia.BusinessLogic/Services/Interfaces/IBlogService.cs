using SocialMedia.BusinessLogic.Dtos;
using SocialMedia.DataAccess.Models;

namespace SocialMedia.WebApi.Services.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogPost>?> GetAll();
        Task<BlogPost?> GetById(Guid id);
        Task<IEnumerable<BlogPost>?> GetByUserId(Guid userId);
        Task<BlogPost?> Create(BlogPost blogPost);
        Task<Like?> GetLike(Guid? postId, Guid? userId);
        Task<IEnumerable<Like>?> GetLikes(Guid? postId);
        Task<IEnumerable<Like>?> GetUserLikes(Guid? userId, PostsRequestModel posts);
        Task<Like?> SetLike(Guid postId, Guid? userId);
    }
}
