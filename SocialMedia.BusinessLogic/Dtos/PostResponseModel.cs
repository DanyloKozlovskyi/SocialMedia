﻿using SocialMedia.BusinessLogic.Dtos.Identity;
using SocialMedia.DataAccess.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.BusinessLogic.Dtos;
public class PostResponseModel
{
    public Guid Id { get; set; }
    public string? Description { get; set; }
    public string? Image64 { get; set; }
    public DateTime PostedAt { get; set; }
    public Guid UserId { get; set; }
    public UserResponseModel? User { get; set; }
    public int LikeCount { get; set; }
    public Guid? ParentId { get; set; }
    public List<PostResponseModel>? Comments { get; set; }
    public int CommentCount { get; set; }
    public bool IsLiked { get; set; } = false;
    public bool IsCommented { get; set; } = false;
}
