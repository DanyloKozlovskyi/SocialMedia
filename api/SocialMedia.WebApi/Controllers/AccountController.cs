using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMedia.Application.Identity;
using SocialMedia.Application.Identity.Dtos;
using SocialMedia.Application.Images;
using SocialMedia.Domain.Entities.Identity;
using System.Security.Claims;

namespace SocialMedia.WebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly SignInManager<ApplicationUser> _signInManager;
		private readonly RoleManager<ApplicationRole> roleManager;
		private readonly IJwtService _jwtService;
		private readonly IImageRepository _imageRepository;
		private readonly IMapper mapper;
		private readonly IUserFollowService _userFollowService;

		public AccountController(UserManager<ApplicationUser> userMng,
			SignInManager<ApplicationUser> signInMng, RoleManager<ApplicationRole> roleMng, IJwtService jwtSvc, IMapper mapp, IImageRepository imageRepository, IUserFollowService userFollowService)
		{
			_userManager = userMng;
			_signInManager = signInMng;
			roleManager = roleMng;
			_jwtService = jwtSvc;
			mapper = mapp;
			_imageRepository = imageRepository;
			_userFollowService = userFollowService;
		}

		private Guid? GetUserId()
		{
			var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
			Guid? userId = Guid.TryParse(userIdString, out var parsed) ? parsed : (Guid?)null;
			return userId;
		}

		[HttpGet("[action]")]
		[Authorize]
		public async Task<IActionResult> GetPersonalInfo()
		{
			var userId = GetUserId();
			var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
			return Ok(user);
		}

		[HttpGet("[action]/{userId}")]
		[Authorize]
		public async Task<IActionResult> GetUserInfo([FromRoute] Guid userId)
		{
			var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
			return Ok(user);
		}

		[HttpGet("[action]")]
		[Authorize]
		public async Task<IActionResult> FilterUsers([FromQuery] string query = "", [FromQuery] int page = 1, [FromQuery] int pageSize = 30)
		{
			var usersQuery = _userManager.Users.AsQueryable();

			if (!string.IsNullOrWhiteSpace(query))
				usersQuery = usersQuery.Where(u => u.Name.ToLower().Contains(query.ToLower()));

			var users = await usersQuery
				.OrderByDescending(u => (u.Likes.Count() * 0.1) + u.Posts.Count())
				.Skip((page - 1) * pageSize)
				.Take(pageSize)
				.ToListAsync();

			return Ok(users);
		}

		[HttpPost("[action]")]
		[Authorize]
		public async Task<IActionResult> EditProfile(UpdateUser updateUser)
		{
			var userId = GetUserId();
			var userIdString = userId.ToString();
			var user = await _userManager.FindByIdAsync(userIdString);
			if (user == null)
				return NotFound();

			string oldKey = user.LogoKey;
			string newKey = updateUser.LogoKey;

			// Update fields
			user.Name = updateUser.Name;
			user.Description = updateUser.Description;
			user.LogoKey = updateUser.LogoKey;
			user.LogoContentType = updateUser.LogoContentType;

			var result = await _userManager.UpdateAsync(user);

			if (!result.Succeeded)
				return BadRequest(result.Errors);

			else if (!string.IsNullOrEmpty(oldKey) && oldKey != newKey)
				await _imageRepository.DeleteAsync(oldKey);

			return Ok("User updated successfully");
		}

		[HttpPost("[action]")]
		[AllowAnonymous]
		public async Task<IActionResult> Register(RegisterDto registerDto)
		{
			// Validation 
			if (!ModelState.IsValid)
			{
				string errorMessages = string.Join(" | ", ModelState.Values.SelectMany(x => x.Errors).Select(e => e.ErrorMessage));
				return Problem(errorMessages);
			}

			// Create user
			ApplicationUser user = mapper.Map<ApplicationUser>(registerDto);

			IdentityResult result = null;
			try
			{
				result = await _userManager.CreateAsync(user, registerDto.Password);
			}
			catch (Exception exc)
			{
				Console.WriteLine(exc.Message);
			}

			if (result.Succeeded)
			{
				// sign-in
				// isPersister: false - must be deleted automatically when the browser is closed
				await _signInManager.SignInAsync(user, isPersistent: false);

				var authenticationResponse = _jwtService.CreateJwtToken(user);
				user.RefreshToken = authenticationResponse.RefreshToken;

				user.RefreshTokenExpirationDateTime = authenticationResponse.RefreshTokenExpirationDateTime;
				await _userManager.UpdateAsync(user);

				return Ok(authenticationResponse);
			}

			string errorMessage = string.Join(" | ", result.Errors.Select(e => e.Description));
			return Problem(errorMessage);
		}

		[HttpGet("[action]")]
		[Authorize]
		public async Task<IActionResult> IsEmailAlreadyRegistered(string email)
		{
			ApplicationUser? user = await _userManager.FindByEmailAsync(email);

			if (user == null)
			{
				return Ok(true);
			}
			return Ok(false);
		}

		[HttpPost("[action]")]
		[AllowAnonymous]
		public async Task<IActionResult> Login(LoginDto loginDTO)
		{
			// Validation 
			if (!ModelState.IsValid)
			{
				string errorMessages = string.Join(" | ", ModelState.Values.SelectMany(x => x.Errors).Select(e => e.ErrorMessage));
				return Problem(errorMessages);
			}

			var result = await _signInManager.PasswordSignInAsync(loginDTO.Email, loginDTO.Password, isPersistent: false, lockoutOnFailure: false);

			if (result.Succeeded)
			{
				ApplicationUser? user = await _userManager.FindByEmailAsync(loginDTO.Email);

				if (user == null)
					return NoContent();

				await _signInManager.SignInAsync(user, isPersistent: false);

				var authenticationResponse = _jwtService.CreateJwtToken(user);
				user.RefreshToken = authenticationResponse.RefreshToken;

				user.RefreshTokenExpirationDateTime = authenticationResponse.RefreshTokenExpirationDateTime;
				try
				{
					await _userManager.UpdateAsync(user);
				}
				catch (Exception exc)
				{
					Console.WriteLine($"await userManager.UpdateAsync(user): {exc.Message}");
				}

				return Ok(authenticationResponse);
			}
			return Problem("Invalid email or password");
		}

		[HttpGet("[action]")]
		[Authorize]
		public async Task<IActionResult> Logout()
		{
			await _signInManager.SignOutAsync();

			return NoContent();
		}

		[HttpPost("[action]")]
		[AllowAnonymous]
		public async Task<IActionResult> Refresh(TokenModel tokenModel)
		{
			if (tokenModel == null)
			{
				return Unauthorized("Invalid client request");
			}

			string? token = tokenModel.Token;
			string? refreshToken = tokenModel.RefreshToken;

			ClaimsPrincipal? principal = _jwtService.GetPrincipalFromJwtToken(token);
			if (principal == null)
			{
				return Unauthorized("Invalid access token");
			}

			string? email = principal.FindFirstValue(ClaimTypes.Email);

			ApplicationUser? user = await _userManager.FindByEmailAsync(email);

			if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpirationDateTime <= DateTime.UtcNow)
			{
				return Unauthorized("Invalid refresh token");
			}

			AuthenticationResponse authenticationResponse = _jwtService.CreateJwtToken(user);

			user.RefreshToken = authenticationResponse.RefreshToken;
			user.RefreshTokenExpirationDateTime = authenticationResponse.RefreshTokenExpirationDateTime;

			await _userManager.UpdateAsync(user);

			return Ok(authenticationResponse);
		}

		[HttpPost("[action]/{targetUserId}")]
		[Authorize]
		public async Task<IActionResult> Follow([FromRoute] Guid targetUserId)
		{
			var userId = GetUserId();
			if (userId == null)
				return Unauthorized();

			if (userId == targetUserId)
				return BadRequest("You cannot follow yourself");

			var targetUser = await _userManager.FindByIdAsync(targetUserId.ToString());
			if (targetUser == null)
				return NotFound("User not found");

			var result = await _userFollowService.Follow(userId.Value, targetUserId);
			if (!result)
				return BadRequest("You are already following this user");

			return Ok("Successfully followed user");
		}

		[HttpDelete("[action]/{targetUserId}")]
		[Authorize]
		public async Task<IActionResult> Unfollow([FromRoute] Guid targetUserId)
		{
			var userId = GetUserId();
			if (userId == null)
				return Unauthorized();

			var result = await _userFollowService.Unfollow(userId.Value, targetUserId);
			if (!result)
				return BadRequest("You are not following this user");

			return Ok("Successfully unfollowed user");
		}

		[HttpGet("[action]/{targetUserId}")]
		[Authorize]
		public async Task<IActionResult> GetFollowStatus([FromRoute] Guid targetUserId)
		{
			var userId = GetUserId();
			var status = await _userFollowService.GetFollowStatus(userId, targetUserId);
			return Ok(status);
		}

		[HttpGet("[action]/{targetUserId}")]
		[Authorize]
		public async Task<IActionResult> GetFollowers([FromRoute] Guid targetUserId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
		{
			var followers = await _userFollowService.GetFollowers(targetUserId, page, pageSize);
			return Ok(followers);
		}

		[HttpGet("[action]/{targetUserId}")]
		[Authorize]
		public async Task<IActionResult> GetFollowing([FromRoute] Guid targetUserId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
		{
			var following = await _userFollowService.GetFollowing(targetUserId, page, pageSize);
			return Ok(following);
		}
	}
}
