using SocialMedia.BusinessLogic.Dtos;
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
            UserName = post.User?.UserName,
            LikeCount = post.Likes != null ? post.Likes.Count(x => x.IsLiked) : 0,
            Comments = post.Comments != null
                ? post.Comments.Select(comment => new PostResponseModel
                {
                    Id = comment.Id,
                    Description = comment.Description,
                    Image64 = comment.Image64,
                    PostedAt = comment.PostedAt,
                    UserId = comment.UserId,
                    UserName = comment.User?.UserName,
                    LikeCount = comment.Likes != null ? comment.Likes.Count() : 0,
                    ParentId = comment.ParentId,
                    Comments = null // Prevent deeper nesting of comments
                }).ToList()
                : null,
            IsLiked = userRequestId != null ? Convert.ToBoolean(post?.Likes?.Count(x=>x.UserId == userRequestId)) : false
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
            UserName = post.User.UserName, // Assuming User is included in the query
            LikeCount = post.Likes.Count(x => x.IsLiked),
            Comments = post.Comments != null
                ? post.Comments.Select(comment => new PostResponseModel
                {
                    Id = comment.Id,
                    Description = comment.Description,
                    Image64 = comment.Image64,
                    PostedAt = comment.PostedAt,
                    UserId = comment.UserId,
                    UserName = comment.User.UserName, // Assuming User is included
                    LikeCount = comment.Likes.Count(),
                    ParentId = comment.ParentId,
                    Comments = null // Prevent deeper nesting of comments
                }).ToList()
                : null,
            IsLiked = userRequestId != null ? Convert.ToBoolean(post.Likes.Count(x => x.UserId == userRequestId)) : false
        });
    }
}
