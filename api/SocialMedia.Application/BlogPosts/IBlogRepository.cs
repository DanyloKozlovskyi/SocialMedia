using SocialMedia.Domain;
using SocialMedia.Domain.Entities;
using System.Linq.Expressions;

namespace SocialMedia.Application.BlogPosts;
public interface IBlogRepository
{
	public Task<BlogPost> Create(BlogPost entity);

	public Task<IEnumerable<BlogPost>> Create(IEnumerable<BlogPost> entities);

	public Task Delete(BlogPost entity);

	public Task<IEnumerable<BlogPost>> GetAll();

	public Task<IEnumerable<BlogPost>> GetAllWithDetails(string includeProperties = "");

	public Task<IEnumerable<BlogPost>> GetByFilter(Expression<Func<BlogPost, bool>> whereExpression, int page = -1, int pageSize = -1, string includeProperties = "");
	public Task<int> Count(Expression<Func<BlogPost, bool>>? whereExpression);

	public IQueryable<BlogPost> GetByFilterNoTracking(Expression<Func<BlogPost, bool>> whereExpression, string includeProperties = "");

	public Task<BlogPost> GetById(Guid id);

	public Task<BlogPost> GetByIdWithDetails(Guid id, string includeProperties = "");

	public Task<BlogPost> Update(BlogPost entity);

	public IQueryable<BlogPost> Get(
		int skip = 0,
		int take = 0,
		string includeProperties = "",
		Expression<Func<BlogPost, bool>> whereExpression = null,
		Dictionary<Expression<Func<BlogPost, object>>, SortDirection> orderBy = null,
		bool asNoTracking = false);

	public Task<bool> Any(Expression<Func<BlogPost, bool>> whereExpression = null);

	public Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess = true, CancellationToken cancellationToken = default);

	public int SaveChanges(bool acceptAllChangesOnSuccess = true);
}
