using SocialMedia.Application;
using SocialMedia.Application.BlogPosts;
using SocialMedia.Application.BlogPosts.Redis;
using SocialMedia.Domain;
using SocialMedia.Domain.Entities;
using System.Linq.Expressions;

namespace SocialMedia.Infrastructure.Persistence.Repositories;
public class BlogRepositoryCacheDecorator : IBlogRepository
{
	private readonly IEntityRepository<Guid, BlogPost> _repository;

	public BlogRepositoryCacheDecorator(IEntityRepository<Guid, BlogPost> repository) : base()
	{
		_repository = repository;
	}
	public async Task<bool> Any(Expression<Func<BlogPost, bool>> whereExpression = null)
	{
		return await _repository.Any(whereExpression);
	}

	public async Task<int> Count(Expression<Func<BlogPost, bool>>? whereExpression)
	{
		return await _repository.Count(whereExpression);
	}

	public async Task<BlogPost> Create(BlogPost entity)
	{
		return await _repository.Create(entity);
	}

	public async Task<IEnumerable<BlogPost>> Create(IEnumerable<BlogPost> entities)
	{
		return await _repository.Create(entities);
	}

	public Task Delete(BlogPost entity)
	{
		return _repository.Delete(entity);
	}

	public IQueryable<BlogPost> Get(int skip = 0, int take = 0, string includeProperties = "", Expression<Func<BlogPost, bool>> whereExpression = null, Dictionary<Expression<Func<BlogPost, object>>, SortDirection> orderBy = null, bool asNoTracking = false)
	{
		return _repository.Get(skip, take, includeProperties, whereExpression, orderBy, asNoTracking);
	}

	public async Task<IEnumerable<BlogPost>> GetAll()
	{
		return await _repository.GetAll();
	}

	public async Task<IEnumerable<BlogPost>> GetAllWithDetails(string includeProperties = "")
	{
		return await _repository.GetAllWithDetails(includeProperties);
	}

	public async Task<IEnumerable<BlogPost>> GetByFilter(Expression<Func<BlogPost, bool>> whereExpression, int page = -1, int pageSize = -1, string includeProperties = "")
	{
		return await _repository.GetByFilter(whereExpression, page, pageSize, includeProperties);
	}

	public IQueryable<BlogPost> GetByFilterNoTracking(Expression<Func<BlogPost, bool>> whereExpression, string includeProperties = "")
	{
		return _repository.GetByFilterNoTracking(whereExpression, includeProperties);
	}

	public async Task<BlogPost> GetById(Guid id)
	{
		return await _repository.GetById(id);
	}

	public async Task<BlogPost> GetByIdWithDetails(Guid id, string includeProperties = "")
	{
		return await _repository.GetByIdWithDetails(id, includeProperties);
	}

	public int SaveChanges(bool acceptAllChangesOnSuccess = true)
	{
		return _repository.SaveChanges();
	}

	public Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess = true, CancellationToken cancellationToken = default)
	{
		return _repository.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
	}

	public async Task<BlogPost> Update(BlogPost entity)
	{
		return await _repository.Update(entity);
	}
}
