using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.DataAccess.Models;
using SocialMedia.WebApi.Services.Interfaces;
using System.Security.Claims;

namespace SocialMedia.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService blogPostService;
        public BlogController(IBlogService blogService)
        {
            blogPostService = blogService;
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> All()
        {
            var blogs =  await blogPostService.GetAll();
            return Ok(blogs);
        }
        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> Create(BlogPost blogPost)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            blogPost.PostedAt = DateTime.Now;
            blogPost.UserId = userId;
            blogPost.Description = blogPost.Description.Trim();

            var blog = await blogPostService.Create(blogPost);
            return Ok(blog);
        }
        [HttpGet("[action]/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var blog = await blogPostService.GetById(id);
            return Ok(blog);
        }
        [HttpGet("[action]/{id}")]
        [Authorize]
        public async Task<IActionResult> GetByUserId(Guid id)
        {
            var blogs = await blogPostService.GetByUserId(id);
            return Ok(blogs);
        }
    }
}
