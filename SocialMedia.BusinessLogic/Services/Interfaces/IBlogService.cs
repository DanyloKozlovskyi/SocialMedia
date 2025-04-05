using SocialMedia.DataAccess.Models;

namespace SocialMedia.WebApi.Services.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogPost>?> GetAll();
        Task<BlogPost?> GetById(Guid id);
        Task<IEnumerable<BlogPost>?> GetByUserId(Guid userId);
    }
}
