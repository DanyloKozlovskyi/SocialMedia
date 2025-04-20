using SocialMedia.BusinessLogic.Dtos;
using SocialMedia.DataAccess.Models;

namespace SocialMedia.WebApi.Services.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<PostResponseModel>?> GetAll();
        Task<PostResponseModel?> GetById(Guid id);
        Task<IEnumerable<BlogPost>?> GetByUserId(Guid userId);
        Task<BlogPost?> Create(BlogPost blogPost);
        Task<Like?> GetLike(Guid? postId, Guid? userId);
        Task<IEnumerable<Like>?> GetLikes(Guid? postId);
        Task<IEnumerable<Like>?> GetUserLikes(Guid? userId, PostsRequestModel posts);
        Task<int> SetLike(Guid postId, Guid userId);
        Task<IEnumerable<BlogPost>?> GetByParentId(Guid parentId);
    }
}
