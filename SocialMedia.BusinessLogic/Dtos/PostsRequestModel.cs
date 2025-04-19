using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.BusinessLogic.Dtos;
public class PostsRequestModel
{
    public List<Guid> PostIds { get; set; }
}
