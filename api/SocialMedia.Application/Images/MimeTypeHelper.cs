using Microsoft.AspNetCore.StaticFiles;

namespace SocialMedia.Application.Images;

public static class MimeTypeHelper
{
	private static readonly FileExtensionContentTypeProvider _provider = new();

	public static string Detect(string fileName)
		=> _provider.TryGetContentType(fileName, out var ct)
			   ? ct
			   : "application/octet-stream";
}
