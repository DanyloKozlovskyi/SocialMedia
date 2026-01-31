using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMedia.Domain.Entities;
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

	[HttpGet("conversations")]
	public async Task<IActionResult> GetConversations()
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		var conversations = await _context.ConversationParticipants
			.Where(cp => cp.UserId == currentUserId)
			.Include(cp => cp.Conversation)
				.ThenInclude(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
			.Include(cp => cp.Conversation)
				.ThenInclude(c => c.Participants)
					.ThenInclude(p => p.User)
			.Select(cp => new
			{
				ConversationId = cp.ConversationId,
				LastMessage = cp.Conversation.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault(),
				Participants = cp.Conversation.Participants
					.Where(p => p.UserId != currentUserId)
					.Select(p => new
					{
						p.UserId,
						p.User.Name,
						p.User.LogoKey,
						p.User.LogoContentType
					})
					.ToList(),
				UnreadCount = cp.Conversation.Messages.Count(m => m.SenderId != currentUserId && !m.IsRead)
			})
			.ToListAsync();

		return Ok(conversations);
	}

	[HttpGet("conversation/{conversationId}")]
	public async Task<IActionResult> GetMessages(Guid conversationId)
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		var isParticipant = await _context.ConversationParticipants
			.AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == currentUserId);

		if (!isParticipant)
		{
			return Forbid();
		}

		var messages = await _context.Messages
			.Where(m => m.ConversationId == conversationId)
			.OrderBy(m => m.CreatedAt)
			.Include(m => m.Sender)
			.ToListAsync();

		return Ok(messages);
	}

	[HttpPost("conversation/start")]
	public async Task<IActionResult> StartConversation([FromBody] Guid otherUserId)
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		var existingConversation = await _context.ConversationParticipants
			.Where(cp => cp.UserId == currentUserId)
			.Select(cp => cp.Conversation)
			.Where(c => c.Participants.Count == 2 && 
					   c.Participants.Any(p => p.UserId == otherUserId))
			.FirstOrDefaultAsync();

		if (existingConversation != null)
		{
			return Ok(new { ConversationId = existingConversation.Id });
		}

		var conversation = new Conversation
		{
			Id = Guid.NewGuid(),
			CreatedAt = DateTime.UtcNow,
			UpdatedAt = DateTime.UtcNow
		};

		_context.Conversations.Add(conversation);

		_context.ConversationParticipants.Add(new ConversationParticipant
		{
			ConversationId = conversation.Id,
			UserId = currentUserId,
			JoinedAt = DateTime.UtcNow
		});

		_context.ConversationParticipants.Add(new ConversationParticipant
		{
			ConversationId = conversation.Id,
			UserId = otherUserId,
			JoinedAt = DateTime.UtcNow
		});

		await _context.SaveChangesAsync();

		return Ok(new { ConversationId = conversation.Id });
	}
}
