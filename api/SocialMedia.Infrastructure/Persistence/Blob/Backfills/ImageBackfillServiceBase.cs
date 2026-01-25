using Microsoft.Extensions.Logging;
using MimeDetective;
using MimeDetective.Definitions;
using SocialMedia.Application.Images;
using SocialMedia.Infrastructure.Persistence.Sql;
using System.Text.RegularExpressions;

namespace SocialMedia.Infrastructure.Persistence.Blob.Backfills;
public abstract class ImageBackfillServiceBase
{
	protected readonly SocialMediaDbContext _db;
	protected readonly IImageService _imageService;
	protected readonly ILogger<BlogBackfillService> _logger;
	protected static readonly IContentInspector Inspector =
	new ContentInspectorBuilder
	{
		Definitions = DefaultDefinitions.All()
	}.Build();

	public ImageBackfillServiceBase(SocialMediaDbContext db, IImageService imageService, ILogger<BlogBackfillService> logger)
	{
		_db = db;
		_imageService = imageService;
		_logger = logger;
	}

	protected static readonly Dictionary<string, string> MimeToExt = new(StringComparer.OrdinalIgnoreCase)
	{
		["image/jpeg"] = ".jpg",
		["image/png"] = ".png",
		["image/gif"] = ".gif",
		["image/webp"] = ".webp",
		["image/bmp"] = ".bmp",
		["image/tiff"] = ".tiff",
		["image/svg+xml"] = ".svg",
		["image/heic"] = ".heic",
		["image/avif"] = ".avif"
	};

	protected static bool TryGetMimeFromDataUri(string b64, out string mime)
	{
		mime = "";
		const string pat = @"^data:(?<mime>[\w\-\.+/]+);base64,";
		var m = Regex.Match(b64, pat, RegexOptions.IgnoreCase);
		if (!m.Success) return false;
		mime = m.Groups["mime"].Value;
		return true;
	}

	protected static bool TryDecodeBase64(string input, out byte[] bytes)
	{
		var comma = input.IndexOf(',');
		if (comma >= 0 && input.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
			input = input[(comma + 1)..];

		try { bytes = Convert.FromBase64String(input); return true; }
		catch { bytes = Array.Empty<byte>(); return false; }
	}

	protected static (string mime, string ext) DetectMimeFromBase64(string b64, byte[] bytes)
	{
		if (TryGetMimeFromDataUri(b64, out var mimeFromUri))
			return (mimeFromUri, MimeToExt.TryGetValue(mimeFromUri, out var e) ? e : ".bin");

		var match = Inspector.Inspect(bytes).FirstOrDefault();
		if (match is null)
			return ("application/octet-stream", ".bin");

		var def = match.Definition;
		var mime = def?.File?.MimeType ?? "application/octet-stream";
		var ext = MimeToExt.TryGetValue(mime, out var mapped) ? mapped : ".bin";
		return (mime, ext);
	}
}
