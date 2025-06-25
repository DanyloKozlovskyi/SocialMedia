using SocialMedia.Application.Dtos;
using SocialMedia.Domain.Entities;

namespace SocialMedia.Application.Services.Interfaces;
public interface IBlogService
{
	float CosineSimilarity(float[] vec1, float[] vec2);
	Task<List<Guid>> ComputeRecommendedPostIdsAsync(IQueryable<BlogPost> queryablePosts, Guid? userId, int page, int pageSize);
	Task<IEnumerable<PostResponseModel>> GetAll(Guid? userId = null, int page = 1, int pageSize = 30);
	Task<PostResponseModel?> GetById(Guid id, Guid? userId = null);
	Task<IEnumerable<PostResponseModel>?> GetParents(Guid id, Guid? userRequestId = null);
	Task<IEnumerable<PostResponseModel>?> GetByDescription(string description, Guid? userRequestId = null, int page = 1, int pageSize = 30);
	Task<IEnumerable<PostResponseModel>?> GetByUserId(Guid userId, Guid? userRequestId = null, int page = 1, int pageSize = 30);
	Task<BlogPost?> Create(BlogPost blogPost);
	Task<Like?> GetLike(Guid? postId, Guid? userId);
	Task<IEnumerable<Like>?> GetLikes(Guid? postId);
	Task<IEnumerable<Like>?> GetUserLikes(Guid? userId, PostsRequestModel posts);
	Task<int> SetLike(Guid postId, Guid userId);
	Task<IEnumerable<PostResponseModel>?> GetByParentId(Guid parentId, Guid? userId = null, int page = 1, int pageSize = 30);
}
