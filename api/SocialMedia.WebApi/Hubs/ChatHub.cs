using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SocialMedia.Domain.Entities;
using SocialMedia.Infrastructure.Persistence.Sql;
using System.Security.Claims;

namespace SocialMedia.WebApi.Hubs;

[Authorize]
public class ChatHub : Hub
{
	private readonly SocialMediaDbContext _context;

	public ChatHub(SocialMediaDbContext context)
	{
		_context = context;
	}

	public override async Task OnConnectedAsync()
	{
		var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (userIdClaim != null && Guid.TryParse(userIdClaim, out var userId))
		{
			var conversationIds = await _context.ConversationParticipants
				.Where(cp => cp.UserId == userId)
				.Select(cp => cp.ConversationId.ToString())
				.ToListAsync();

			foreach (var conversationId in conversationIds)
			{
				await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
			}
		}

		await base.OnConnectedAsync();
	}

	public async Task JoinConversation(Guid conversationId)
	{
		var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
		{
			throw new HubException("Unauthorized");
		}

		var isParticipant = await _context.ConversationParticipants
			.AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == userId);

		if (!isParticipant)
		{
			throw new HubException("Not a participant of this conversation");
		}

		await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
	}

	public async Task SendMessage(Guid conversationId, string? content, string? mediaKey, string? mediaContentType, string? mediaType)
	{
		var senderIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (senderIdClaim == null || !Guid.TryParse(senderIdClaim, out var senderId))
		{
			throw new HubException("Unauthorized");
		}

		var isParticipant = await _context.ConversationParticipants
			.AnyAsync(cp => cp.ConversationId == conversationId && cp.UserId == senderId);

		if (!isParticipant)
		{
			throw new HubException("Not a participant of this conversation");
		}

		var message = new Message
		{
			Id = Guid.NewGuid(),
			SenderId = senderId,
			ConversationId = conversationId,
			Content = content,
			MediaKey = mediaKey,
			MediaContentType = mediaContentType,
			MediaType = mediaType,
			CreatedAt = DateTime.UtcNow,
			IsRead = false
		};

		_context.Messages.Add(message);
		await _context.SaveChangesAsync();

		var conversation = await _context.Conversations
			.FirstOrDefaultAsync(c => c.Id == conversationId);

		if (conversation != null)
		{
			conversation.UpdatedAt = DateTime.UtcNow;
			await _context.SaveChangesAsync();
		}

		await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", message);
	}

	public async Task MarkAsRead(Guid messageId)
	{
		var message = await _context.Messages.FindAsync(messageId);
		if (message != null)
		{
			message.IsRead = true;
			await _context.SaveChangesAsync();
		}
	}
}
