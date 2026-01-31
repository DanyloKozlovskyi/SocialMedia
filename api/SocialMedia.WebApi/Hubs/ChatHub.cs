using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialMedia.Application.Chat;
using System.Security.Claims;

namespace SocialMedia.WebApi.Hubs;

[Authorize]
public class ChatHub : Hub
{
	private readonly IChatService _chatService;
	private readonly IConversationRepository _conversationRepository;

	public ChatHub(IChatService chatService, IConversationRepository conversationRepository)
	{
		_chatService = chatService;
		_conversationRepository = conversationRepository;
	}

	public override async Task OnConnectedAsync()
	{
		var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
		if (userIdClaim != null && Guid.TryParse(userIdClaim, out var userId))
		{
			var conversations = await _conversationRepository.GetConversationsByUserId(userId);
			var conversationIds = conversations.Select(c => c.Id.ToString());

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

		var isParticipant = await _conversationRepository.IsParticipant(conversationId, userId);

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

		try
		{
			var message = await _chatService.SendMessage(senderId, conversationId, content, mediaKey, mediaContentType, mediaType);
			await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", message);
		}
		catch (UnauthorizedAccessException)
		{
			throw new HubException("Not a participant of this conversation");
		}
	}

	public async Task MarkAsRead(Guid messageId)
	{
		await _chatService.MarkAsRead(messageId);
	}
}
