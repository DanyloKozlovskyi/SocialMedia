using SocialMedia.BusinessLogic.Dtos;
using SocialMedia.BusinessLogic.Dtos.Identity;
using SocialMedia.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.BusinessLogic.Utilities;

public static class BlogPostExtension
{
    public static PostResponseModel ToPostResponseModel(this BlogPost post, Guid? userRequestId=null)
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
            Comments = post.Comments != null
                ? post.Comments.Select(comment => new PostResponseModel
                {
                    Id = comment.Id,
                    Description = comment.Description,
                    Image64 = comment.Image64,
                    PostedAt = comment.PostedAt,
                    UserId = comment.UserId,
                    User = new UserResponseModel() { UserName = comment.User?.Name, Description = comment.User?.Description, Logo = comment.User?.Logo, Id = comment.UserId },
                    LikeCount = comment.Likes != null ? comment.Likes.Count() : 0,
                    ParentId = comment.ParentId,
                    Comments = null, // Prevent deeper nesting of comments
                    CommentCount = comment.Comments != null ? comment.Comments.Count() : 0,
                    IsLiked = userRequestId != null ? comment.Likes.Any(x => x.UserId == userRequestId && x.IsLiked) : false,
                    IsCommented = userRequestId != null ? comment.Comments.Any(x => x.UserId == userRequestId) : false
                }).ToList()
                : null,
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
            User = new UserResponseModel() { UserName = post.User.Name, Description = post.User.Description, Logo = post.User.Logo, Id = post.UserId },
            LikeCount = post.Likes.Count(x => x.IsLiked),
            Comments = post.Comments != null
                ? post.Comments.Select(comment => new PostResponseModel
                {
                    Id = comment.Id,
                    Description = comment.Description,
                    Image64 = comment.Image64,
                    PostedAt = comment.PostedAt,
                    UserId = comment.UserId,
                    User = new UserResponseModel() { UserName = comment.User.Name, Description = comment.User.Description, Logo = comment.User.Logo, Id = comment.UserId },
                    LikeCount = comment.Likes.Count(),
                    ParentId = comment.ParentId,
                    Comments = null, // Prevent deeper nesting of comments
                    CommentCount = comment.Comments != null ? comment.Comments.Count() : 0,
                    IsLiked = userRequestId != null ? comment.Likes.Any(x => x.UserId == userRequestId && x.IsLiked) : false,
                    IsCommented = userRequestId != null ? comment.Comments.Any(x => x.UserId == userRequestId) : false
                }).ToList()
                : null,
            CommentCount = post.Comments != null ? post.Comments.Count() : 0,
            IsLiked = userRequestId != null ? post.Likes.Any(x => x.UserId == userRequestId && x.IsLiked) : false,
            IsCommented = userRequestId != null ? post.Comments.Any(x => x.UserId == userRequestId) : false
        });
    }
}
