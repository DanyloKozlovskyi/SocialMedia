﻿using AutoMapper;
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
        }
    }
}
