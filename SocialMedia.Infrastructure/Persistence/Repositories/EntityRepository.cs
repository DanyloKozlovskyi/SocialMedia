using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SocialMedia.Application;
using SocialMedia.Domain;
using SocialMedia.Infrastructure.Persistence.Repositories.Extensions;
using System.Linq.Expressions;

namespace SocialMedia.Infrastructure.Persistence.Repositories;

public class EntityRepository<TKey, TEntity> : IEntityRepository<TKey, TEntity>
	where TEntity : class, IKeyedEntity<TKey>, new()
	where TKey : IEquatable<TKey>
{
	public readonly SocialMediaDbContext _dbContext;
	public readonly DbSet<TEntity> _dbSet;

	public EntityRepository(SocialMediaDbContext dbContext) : base()
	{
		_dbContext = dbContext;
		_dbSet = _dbContext.Set<TEntity>();
	}

	public async Task<TEntity> Create(TEntity entity)
	{
		await _dbSet.AddAsync(entity).ConfigureAwait(false);
		await _dbContext.SaveChangesAsync().ConfigureAwait(false);

		return await Task.FromResult(entity).ConfigureAwait(false);
	}

	public async Task<IEnumerable<TEntity>> Create(IEnumerable<TEntity> entities)
	{
		await _dbSet.AddRangeAsync(entities).ConfigureAwait(false);
		await _dbContext.SaveChangesAsync().ConfigureAwait(false);

		return await Task.FromResult(entities).ConfigureAwait(false);
	}

	public async Task<T> RunInTransaction<T>(Func<Task<T>> operation)
	{
		var executionStrategy = _dbContext.Database.CreateExecutionStrategy();

		return await executionStrategy.ExecuteAsync(
			async () =>
			{
				await using IDbContextTransaction transaction = await _dbContext.Database.BeginTransactionAsync();
				try
				{
					var result = await operation().ConfigureAwait(false);
					await transaction.CommitAsync().ConfigureAwait(false);
					return result;
				}
				catch (Exception ex)
				{
					await transaction.RollbackAsync().ConfigureAwait(false);
					throw;
				}
			});
	}

	public async Task RunInTransaction(Func<Task> operation)
	{
		var executionStrategy = _dbContext.Database.CreateExecutionStrategy();

		await executionStrategy.ExecuteAsync(
			async () =>
			{
				await using IDbContextTransaction transaction = await _dbContext.Database.BeginTransactionAsync();
				try
				{
					await operation().ConfigureAwait(false);
					await transaction.CommitAsync().ConfigureAwait(false);
				}
				catch (Exception ex)
				{
					await transaction.RollbackAsync().ConfigureAwait(false);
					throw;
				}
			});
	}

	public async Task Delete(TEntity entity)
	{
		_dbContext.Entry(entity).State = EntityState.Deleted;

		await _dbContext.SaveChangesAsync().ConfigureAwait(false);
	}

	public async Task<IEnumerable<TEntity>> GetAll()
	{
		return await _dbSet.ToListAsync().ConfigureAwait(false);
	}

	public async Task<IEnumerable<TEntity>> GetAllWithDetails(string includeProperties = "")
		=> await _dbSet
		.IncludeProperties(includeProperties)
		.ToListAsync();

	public async Task<IEnumerable<TEntity>> GetByFilter(
		Expression<Func<TEntity, bool>> whereExpression, int page = -1, int pageSize = -1,
		string includeProperties = "")
		=> page != -1 && pageSize != -1 ? await _dbSet
		.Where(whereExpression)
		.Skip((page - 1) * pageSize)
		.Take(pageSize)
		.IncludeProperties(includeProperties)
		.ToListAsync()
		.ConfigureAwait(false)
		:
		await _dbSet
		.Where(whereExpression)
		.IncludeProperties(includeProperties)
		.ToListAsync()
		.ConfigureAwait(false);

	public IQueryable<TEntity> GetByFilterNoTracking(
		Expression<Func<TEntity, bool>> whereExpression,
		string includeProperties = "")
		=> _dbSet
		.Where(whereExpression)
		.IncludeProperties(includeProperties)
		.AsNoTracking();

	public Task<TEntity> GetById(TKey id) => _dbSet.FirstOrDefaultAsync(x => x.Id.Equals(id));

	public Task<TEntity> GetByIdWithDetails(TKey id, string includeProperties = "")
		=> _dbSet.Where(x => x.Id.Equals(id)).IncludeProperties(includeProperties).FirstOrDefaultAsync();

	public async Task<TEntity> Update(TEntity entity)
	{
		_dbContext.Entry(entity).State = EntityState.Modified;

		await _dbContext.SaveChangesAsync().ConfigureAwait(false);

		return entity;
	}

	public async Task<TEntity> ReadAndUpdateWith<TDto>(TDto dto, Func<TDto, TEntity, TEntity> map)
		where TDto : IDto<TEntity, TKey>
	{
		ArgumentNullException.ThrowIfNull(dto);

		var entity = await GetById(dto.Id).ConfigureAwait(false);

		if (entity is null)
		{
			var name = typeof(TEntity).Name;
			throw new DbUpdateConcurrencyException($"Updating failed. {name} with Id = {dto.Id} doesn't exist in the system.");
		}

		return await Update(map(dto, entity)).ConfigureAwait(false);
	}

	public virtual IQueryable<TEntity> Get(
		int skip = 0,
		int take = 0,
		string includeProperties = "",
		Expression<Func<TEntity, bool>> whereExpression = null,
		Dictionary<Expression<Func<TEntity, object>>, SortDirection> orderBy = null,
		bool asNoTracking = false)
	{
		IQueryable<TEntity> query = _dbSet;
		if (whereExpression != null)
		{
			query = query.Where(whereExpression);
		}

		if (orderBy != null && orderBy.Any())
		{
			var orderedData = orderBy.Values.First() == SortDirection.Ascending
				? query.OrderBy(orderBy.Keys.First())
				: query.OrderByDescending(orderBy.Keys.First());

			foreach (var expression in orderBy.Skip(1))
			{
				orderedData = expression.Value == SortDirection.Ascending
					? orderedData.ThenBy(expression.Key)
					: orderedData.ThenByDescending(expression.Key);
			}

			query = orderedData;
		}

		if (skip > 0)
		{
			query = query.Skip(skip);
		}

		if (take > 0)
		{
			query = query.Take(take);
		}

		query = query.IncludeProperties(includeProperties);

		return query.If(asNoTracking, q => q.AsNoTracking());
	}

	public Task<bool> Any(Expression<Func<TEntity, bool>> whereExpression = null)
	{
		return whereExpression == null
			? _dbSet.AnyAsync()
			: _dbSet.Where(whereExpression).AnyAsync();
	}

	public Task<int> Count(Expression<Func<TEntity, bool>> whereExpression = null)
	{
		return whereExpression == null
			? _dbSet.CountAsync()
			: _dbSet.Where(whereExpression).CountAsync();
	}

	public Task<int> SaveChangesAsync(
		bool acceptAllChangesOnSuccess = true,
		CancellationToken cancellationToken = default)
	{
		return _dbContext.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
	}

	public int SaveChanges(bool acceptAllChangesOnSuccess = true)
	{
		return _dbContext.SaveChanges();
	}
}
