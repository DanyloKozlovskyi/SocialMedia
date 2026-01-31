using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
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

	public async Task SendMessage(Guid receiverId, string? content, string? mediaKey, string? mediaContentType, string? mediaType)
	{
		var senderIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (senderIdClaim == null || !Guid.TryParse(senderIdClaim, out var senderId))
		{
			throw new HubException("Unauthorized");
		}

		var message = new Message
		{
			Id = Guid.NewGuid(),
			SenderId = senderId,
			ReceiverId = receiverId,
			Content = content,
			MediaKey = mediaKey,
			MediaContentType = mediaContentType,
			MediaType = mediaType,
			CreatedAt = DateTime.UtcNow,
			IsRead = false
		};

		_context.Messages.Add(message);
		await _context.SaveChangesAsync();

		await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", message);
		
		await Clients.Caller.SendAsync("MessageSent", message);
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
