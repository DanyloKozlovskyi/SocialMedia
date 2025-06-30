using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMedia.Application.Identity;
using SocialMedia.Application.Identity.Dtos;
using SocialMedia.Domain.Entities.Identity;
using System.Security.Claims;

namespace SocialMedia.WebApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> userManager;
		private readonly SignInManager<ApplicationUser> signInManager;
		private readonly RoleManager<ApplicationRole> roleManager;
		private readonly IJwtService jwtService;
		private readonly IMapper mapper;

		public AccountController(UserManager<ApplicationUser> userMng,
			SignInManager<ApplicationUser> signInMng, RoleManager<ApplicationRole> roleMng, IJwtService jwtSvc, IMapper mapp)
		{
			userManager = userMng;
			signInManager = signInMng;
			roleManager = roleMng;
			jwtService = jwtSvc;
			mapper = mapp;
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
			var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
			return Ok(user);
		}

		[HttpGet("[action]/{userId}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetUserInfo([FromRoute] Guid userId)
		{
			var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
			return Ok(user);
		}

		[HttpGet("[action]")]
		[AllowAnonymous]
		public async Task<IActionResult> FilterUsers([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 30)
		{
			if (string.IsNullOrWhiteSpace(query))
				return BadRequest("Query is required.");

			var users = await userManager.Users
				.Where(u => u.Name.ToLower().Contains(query.ToLower()))
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
			var user = await userManager.FindByIdAsync(userIdString);
			if (user == null)
				return NotFound();

			// Update fields
			user.Name = updateUser.Name;
			user.Description = updateUser.Description;
			user.Logo = updateUser.Logo;

			var result = await userManager.UpdateAsync(user);

			if (!result.Succeeded)
				return BadRequest(result.Errors);

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
				result = await userManager.CreateAsync(user, registerDto.Password);
			}
			catch (Exception exc)
			{
				Console.WriteLine(exc.Message);
			}

			if (result.Succeeded)
			{
				// sign-in
				// isPersister: false - must be deleted automatically when the browser is closed
				await signInManager.SignInAsync(user, isPersistent: false);

				var authenticationResponse = jwtService.CreateJwtToken(user);
				user.RefreshToken = authenticationResponse.RefreshToken;

				user.RefreshTokenExpirationDateTime = authenticationResponse.RefreshTokenExpirationDateTime;
				await userManager.UpdateAsync(user);

				return Ok(authenticationResponse);
			}

			string errorMessage = string.Join(" | ", result.Errors.Select(e => e.Description));
			return Problem(errorMessage);
		}

		[HttpGet("[action]")]
		[Authorize]
		public async Task<IActionResult> IsEmailAlreadyRegistered(string email)
		{
			ApplicationUser? user = await userManager.FindByEmailAsync(email);

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

			var result = await signInManager.PasswordSignInAsync(loginDTO.Email, loginDTO.Password, isPersistent: false, lockoutOnFailure: false);

			if (result.Succeeded)
			{
				ApplicationUser? user = await userManager.FindByEmailAsync(loginDTO.Email);

				if (user == null)
					return NoContent();

				await signInManager.SignInAsync(user, isPersistent: false);

				var authenticationResponse = jwtService.CreateJwtToken(user);
				user.RefreshToken = authenticationResponse.RefreshToken;

				user.RefreshTokenExpirationDateTime = authenticationResponse.RefreshTokenExpirationDateTime;
				try
				{
					await userManager.UpdateAsync(user);
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
			await signInManager.SignOutAsync();

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

			ClaimsPrincipal? principal = jwtService.GetPrincipalFromJwtToken(token);
			if (principal == null)
			{
				return Unauthorized("Invalid access token");
			}

			string? email = principal.FindFirstValue(ClaimTypes.Email);

			ApplicationUser? user = await userManager.FindByEmailAsync(email);

			if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpirationDateTime <= DateTime.UtcNow)
			{
				return Unauthorized("Invalid refresh token");
			}

			AuthenticationResponse authenticationResponse = jwtService.CreateJwtToken(user);

			user.RefreshToken = authenticationResponse.RefreshToken;
			user.RefreshTokenExpirationDateTime = authenticationResponse.RefreshTokenExpirationDateTime;

			await userManager.UpdateAsync(user);

			return Ok(authenticationResponse);
		}
	}
}
