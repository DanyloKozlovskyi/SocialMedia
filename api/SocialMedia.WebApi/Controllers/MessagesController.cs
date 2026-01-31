using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMedia.Infrastructure.Persistence.Sql;
using System.Security.Claims;

namespace SocialMedia.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
	private readonly SocialMediaDbContext _context;

	public MessagesController(SocialMediaDbContext context)
	{
		_context = context;
	}

	[HttpGet("conversation/{otherUserId}")]
	public async Task<IActionResult> GetConversation(Guid otherUserId)
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		var messages = await _context.Messages
			.Where(m => (m.SenderId == currentUserId && m.ReceiverId == otherUserId) ||
					   (m.SenderId == otherUserId && m.ReceiverId == currentUserId))
			.OrderBy(m => m.CreatedAt)
			.Include(m => m.Sender)
			.Include(m => m.Receiver)
			.ToListAsync();

		return Ok(messages);
	}

	[HttpGet("conversations")]
	public async Task<IActionResult> GetConversations()
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		var conversations = await _context.Messages
			.Where(m => m.SenderId == currentUserId || m.ReceiverId == currentUserId)
			.GroupBy(m => m.SenderId == currentUserId ? m.ReceiverId : m.SenderId)
			.Select(g => new
			{
				UserId = g.Key,
				LastMessage = g.OrderByDescending(m => m.CreatedAt).FirstOrDefault(),
				UnreadCount = g.Count(m => m.ReceiverId == currentUserId && !m.IsRead)
			})
			.ToListAsync();

		return Ok(conversations);
	}
}
