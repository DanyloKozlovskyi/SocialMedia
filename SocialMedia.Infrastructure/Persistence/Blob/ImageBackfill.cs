
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MimeDetective;
using MimeDetective.Definitions;
using MimeDetective.Engine;
using SocialMedia.Infrastructure.Persistence.Sql;
using System;
using System.Text.RegularExpressions;


namespace SocialMedia.Application.Images;
public sealed class ImageBackfill
{
	private readonly SocialMediaDbContext _db;
	private readonly IImageService _imageService;
	private readonly ILogger<ImageBackfill> _logger;
	private static readonly IContentInspector Inspector =
	new ContentInspectorBuilder
	{
		Definitions = DefaultDefinitions.All()
	}.Build();

	public ImageBackfill(SocialMediaDbContext db, IImageService imageService, ILogger<ImageBackfill> logger)
	{
		_db = db;
		_imageService = imageService;
		_logger = logger;
	}

	private static readonly Dictionary<string, string> MimeToExt = new(StringComparer.OrdinalIgnoreCase)
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

	private static bool TryGetMimeFromDataUri(string b64, out string mime)
	{
		mime = "";
		const string pat = @"^data:(?<mime>[\w\-\.+/]+);base64,";
		var m = Regex.Match(b64, pat, RegexOptions.IgnoreCase);
		if (!m.Success) return false;
		mime = m.Groups["mime"].Value;
		return true;
	}

	private static bool TryDecodeBase64(string input, out byte[] bytes)
	{
		var comma = input.IndexOf(',');
		if (comma >= 0 && input.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
			input = input[(comma + 1)..];

		try { bytes = Convert.FromBase64String(input); return true; }
		catch { bytes = Array.Empty<byte>(); return false; }
	}

	private static (string mime, string ext) DetectMimeFromBase64(string b64, byte[] bytes)
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



	public async Task RunAsync(CancellationToken ct)
	{
		//	const int PageSize = 100;

		//	while (true)
		//	{
		//		var batch = await _db.Blogs
		//			.Where(p => p.Image64 != null && p.ImageKey == null)
		//			.OrderBy(p => p.Id)
		//			.Take(PageSize)
		//			.ToListAsync(ct);

		//		if (batch.Count == 0) break;

		//		foreach (var post in batch)
		//		{
		//			try
		//			{
		//				if (!TryDecodeBase64(post.Image64!, out var bytes))
		//				{
		//					_logger.LogWarning("Invalid base64 for post {PostId}", post.Id);
		//					continue;
		//				}

		//				var (mime, ext) = DetectMimeFromBase64(post.Image64!, bytes);

		//				await using var stream = new MemoryStream(bytes, writable: false);

		//				var fileName = $"post-{post.Id}{ext}";
		//				var (key, _, _) = _imageService.GetUploadUrl(fileName);
		//				await _imageService.UploadAsync(stream, key, mime);

		//				post.ImageKey = key;
		//				post.ImageContentType = mime;
		//				//post.Image64 = null;
		//			}
		//			catch (Exception ex)
		//			{
		//				_logger.LogError(ex, "Failed to migrate image for post {PostId}", post.Id);
		//			}
		//		}

		//		await _db.SaveChangesAsync(ct);
		//	}
	}
}

