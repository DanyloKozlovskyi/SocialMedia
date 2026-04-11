using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.Application.Chat;
using SocialMedia.Application.Chat.Dtos;
using System.Security.Claims;

namespace SocialMedia.WebApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
	private readonly IChatService _chatService;

	public MessagesController(IChatService chatService)
	{
		_chatService = chatService;
	}

	[HttpGet("conversations")]
	public async Task<IActionResult> GetConversations()
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		var conversations = await _chatService.GetConversations(currentUserId);
		return Ok(conversations);
	}

	[HttpGet("conversation/{conversationId}")]
	public async Task<IActionResult> GetMessages(Guid conversationId, [FromQuery] DateTime? cursor, [FromQuery] int limit = 20)
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		try
		{
			var messages = await _chatService.GetMessages(conversationId, currentUserId, cursor, limit);

			return Ok(messages);
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	[HttpPost("conversation/start")]
	public async Task<IActionResult> StartConversation([FromBody] Guid otherUserId)
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		var conversationId = await _chatService.StartConversation(currentUserId, otherUserId);
		return Ok(new { ConversationId = conversationId });
	}

	[HttpPost("conversation/group")]
	public async Task<IActionResult> CreateGroupConversation([FromBody] CreateGroupRequest request)
	{
		var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (currentUserIdClaim == null || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
		{
			return Unauthorized();
		}

		try
		{
			var conversationId = await _chatService.CreateGroupConversation(currentUserId, request.Name, request.ParticipantIds);
			return Ok(new { ConversationId = conversationId });
		}
		catch (ArgumentException ex)
		{
			return BadRequest(ex.Message);
		}
	}
}
