using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.BusinessLogic.Dtos;
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

        private Guid? GetUserId()
        {
            var userIdString =  User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid? userId = Guid.TryParse(userIdString, out var parsed) ? parsed : (Guid?)null;
            return userId;
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> All(int page = 1, int pageSize = 30)
        {
            var userId = GetUserId();
            
            var blogs =  await blogPostService.GetAll(userId, page, pageSize);
            return Ok(blogs);
        }
        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> Create(BlogPost blogPost)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            blogPost.PostedAt = DateTime.UtcNow;
            blogPost.UserId = userId;
            blogPost.Description = blogPost.Description.Trim();

            var blog = await blogPostService.Create(blogPost);
            return Ok(blog);
        }
        [HttpGet("[action]/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userId = GetUserId();

            var blog = await blogPostService.GetById(id, userId);
            return Ok(blog);
        }
        [HttpGet("[action]/{parentId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByParentId(Guid parentId, int page = 1, int pageSize = 30)
        {
            var userId = GetUserId();
            try
            {
                var blogs = await blogPostService.GetByParentId(parentId, userId, page, pageSize);

                return Ok(blogs);
            }
            catch (Exception exc)
            {
                Console.WriteLine(exc.Message);
                return Problem(exc.Message);
            }
        }
        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Filter([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 30)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query is required.");

            var userId = GetUserId();
            var posts = await blogPostService.GetByDescription(description: query, userRequestId: userId, page, pageSize);

            return Ok(posts);
        }

        [HttpGet("[action]/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetParents(Guid id)
        {
            var userId = GetUserId();
            try
            {
                var parents = await blogPostService.GetParents(id, userRequestId: userId);
                return Ok(parents);
            }
            catch (Exception exc)
            {
                Console.WriteLine(exc.Message);
                return Problem(exc.Message);
            }
        }

        [HttpGet("[action]/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByUserId(Guid id, int page = 1, int pageSize = 30)
        {
            var userRequestId = GetUserId();

            var blogs = await blogPostService.GetByUserId(id, userRequestId, page, pageSize);
            return Ok(blogs);
        }
        [HttpPut("{id}/[action]")]
        [Authorize]
        public async Task<IActionResult> SetLike(Guid id, [FromBody] Guid userId)
        {
            var likes = await blogPostService.SetLike(id, userId);
            return Ok(likes);
        }
        [HttpGet("{id}/[action]")]
        [Authorize]
        public async Task<IActionResult> GetLike(Guid id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim);

            var like = await blogPostService.GetLike(id, userId);
            return Ok(like);
        }
        [HttpGet("{id}/[action]")]
        [Authorize]
        public async Task<IActionResult> GetLikes(Guid id)
        {
            var likes = await blogPostService.GetLikes(id);
            return Ok(likes);
        }
        [HttpPost("user/{userId}/[action]")]
        [Authorize]
        public async Task<IActionResult> GetUserLikes([FromRoute]Guid userId, [FromBody] PostsRequestModel posts)
        {
            var likes = await blogPostService.GetUserLikes(userId, posts);
            return Ok(likes);
        }
    }
}
