using AutoMapper;
using SocialMedia.WebApi.Dtos.Identity;
using SocialMedia.DataAccess.Identity;
using SocialMedia.DataAccess.Models;
using SocialMedia.BusinessLogic.Dtos;

namespace SocialMedia.BusinessLogic.Utilities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, ApplicationUser>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest=> dest.UserName, opt=>opt.MapFrom(src=>src.Email));

            CreateMap<BlogPost, PostResponseModel>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes != null ? src.Likes.Count(x=>x.IsLiked) : 0))
            .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments != null
                ? src.Comments.Select(comment => new PostResponseModel
                {
                    Id = comment.Id,
                    Description = comment.Description,
                    Image64 = comment.Image64,
                    PostedAt = comment.PostedAt,
                    UserId = comment.UserId,
                    UserName = comment.User.UserName,
                    LikeCount = comment.Likes != null ? comment.Likes.Count() : 0,
                    ParentId = comment.ParentId,
                    Comments = null // Do not go deeper than one level
                }).ToList()
                : null
            ));
        }
    }
}
