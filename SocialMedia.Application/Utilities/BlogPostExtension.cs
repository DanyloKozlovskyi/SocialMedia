using SocialMedia.Application.Dtos;
using SocialMedia.Application.Dtos.Identity;
using SocialMedia.Domain.Entities;


namespace SocialMedia.Application.Utilities;

public static class BlogPostExtension
{
	public static PostResponseModel ToPostResponseModel(this BlogPost post, Guid? userRequestId = null)
	{
		return new PostResponseModel
		{
			Id = post.Id,
			Description = post.Description,
			Image64 = post.Image64,
			PostedAt = post.PostedAt,
			UserId = post.UserId,
			User = new UserResponseModel() { UserName = post.User?.Name, Description = post.User?.Description, Logo = post.User?.Logo, Id = post.UserId },
			LikeCount = post.Likes != null ? post.Likes.Count(x => x.IsLiked) : 0,
			Comments = null,
			CommentCount = post.Comments != null ? post.Comments.Count() : 0,
			IsLiked = userRequestId != null ? post.Likes.Any(x => x.UserId == userRequestId && x.IsLiked) : false,
			IsCommented = userRequestId != null ? post.Comments.Any(x => x.UserId == userRequestId) : false
		};
	}

	public static IQueryable<PostResponseModel> ToPostResponseModelQueryable(this IQueryable<BlogPost> query, Guid? userRequestId = null)
	{
		return query.Select(post => new PostResponseModel
		{
			Id = post.Id,
			Description = post.Description,
			Image64 = post.Image64,
			PostedAt = post.PostedAt,
			UserId = post.UserId,
			User = post.User != null ? new UserResponseModel
			{
				UserName = post.User.Name,
				Description = post.User.Description,
				Logo = post.User.Logo,
				Id = post.UserId
			} : null,
			LikeCount = post.Likes != null ? post.Likes.Count(x => x.IsLiked) : 0,
			Comments = null,
			CommentCount = post.Comments != null ? post.Comments.Count() : 0,
			IsLiked = userRequestId != null && post.Likes != null
			? post.Likes.Any(x => x.UserId == userRequestId && x.IsLiked)
			: false,
			IsCommented = userRequestId != null && post.Comments != null
			? post.Comments.Any(x => x.UserId == userRequestId)
			: false
		});
	}
}
