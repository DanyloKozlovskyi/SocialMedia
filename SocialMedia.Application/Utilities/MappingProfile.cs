using AutoMapper;
using SocialMedia.Application.Dtos.Identity;
using SocialMedia.Domain.Entities.Identity;

namespace SocialMedia.Application.Utilities
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<RegisterDto, ApplicationUser>()
				.ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.UserName))
				.ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
				.ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
				.ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
		}
	}
}
