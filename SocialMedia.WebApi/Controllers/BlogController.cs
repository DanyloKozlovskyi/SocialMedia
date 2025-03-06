using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.WebApi.Services.Interfaces;

namespace SocialMedia.WebApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService blogPostService;
        public BlogController(IBlogService blogService)
        {
            blogPostService = blogService;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> All()
        {
            var blogs =  await blogPostService.GetAll();
            return Ok(blogs);
        }
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var blog = await blogPostService.GetById(id);
            return Ok(blog);
        }
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetByUserId(Guid id)
        {
            var blogs = await blogPostService.GetByUserId(id);
            return Ok(blogs);
        }
    }
}
