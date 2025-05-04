using SocialMedia.BusinessLogic.Dtos;
using SocialMedia.DataAccess.Models;

namespace SocialMedia.WebApi.Services.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<PostResponseModel>?> GetAll(Guid? userId = null);
        Task<PostResponseModel?> GetById(Guid id, Guid? userId = null);
        Task<IEnumerable<PostResponseModel>?> GetByUserId(Guid userId, Guid? userRequestId = null);
        Task<BlogPost?> Create(BlogPost blogPost);
        Task<Like?> GetLike(Guid? postId, Guid? userId);
        Task<IEnumerable<Like>?> GetLikes(Guid? postId);
        Task<IEnumerable<Like>?> GetUserLikes(Guid? userId, PostsRequestModel posts);
        Task<int> SetLike(Guid postId, Guid userId);
        Task<IEnumerable<PostResponseModel>?> GetByParentId(Guid parentId, Guid? userId = null);
    }
}
