using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.BusinessLogic.Dtos.Identity;
public class UserResponseModel
{
    public Guid? Id { get; set; }
    public string? UserName { get; set; }
    public string? Description { get; set; }
    public string? Logo { get; set; }
}
