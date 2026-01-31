using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace SocialMedia.WebApi;

public class NameUserIdProvider : IUserIdProvider
{
	public string? GetUserId(HubConnectionContext connection)
	{
		return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
	}
}
