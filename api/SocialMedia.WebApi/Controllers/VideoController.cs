using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.Application.Videos;
using SocialMedia.Domain.Entities;
using SocialMedia.Infrastructure.Persistence.Sql;
using System.Security.Claims;

namespace SocialMedia.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class VideoController : ControllerBase
{
	private readonly IStorageService _storageService;
	private readonly SocialMediaDbContext _dbContext;
	private const long MaxFileSizeBytes = 30 * 1024 * 1024;
	private const string AllowedContentType = "video/mp4";

	public VideoController(IStorageService storageService, SocialMediaDbContext dbContext)
	{
		_storageService = storageService;
		_dbContext = dbContext;
	}

	[HttpPost("start-upload")]
	public IActionResult StartUpload([FromBody] StartUploadRequest request)
	{
		if (request == null)
			return BadRequest(new { error = "Request body is required" });

		if (string.IsNullOrWhiteSpace(request.FileName))
			return BadRequest(new { error = "FileName is required" });

		if (request.FileSize <= 0)
			return BadRequest(new { error = "FileSize must be greater than 0" });

		if (request.FileSize > MaxFileSizeBytes)
			return BadRequest(new { error = $"File size exceeds maximum allowed size of {MaxFileSizeBytes / (1024 * 1024)}MB" });

		if (string.IsNullOrWhiteSpace(request.ContentType))
			return BadRequest(new { error = "ContentType is required" });

		if (!request.ContentType.Equals(AllowedContentType, StringComparison.OrdinalIgnoreCase))
			return BadRequest(new { error = "Only video/mp4 content type is allowed" });

		try
		{
			var (uploadUrl, storageKey) = _storageService.GeneratePresignedUploadUrl(request.FileName, request.ContentType);
			return Ok(new StartUploadResponse { UploadUrl = uploadUrl, StorageKey = storageKey });
		}
		catch (Exception ex)
		{
			return StatusCode(500, new { error = "Failed to generate upload URL", details = ex.Message });
		}
	}

	[HttpPost("complete-upload")]
	public IActionResult CompleteUpload([FromBody] CompleteUploadRequest request)
	{
		if (request == null)
			return BadRequest(new { error = "Request body is required" });

		if (string.IsNullOrWhiteSpace(request.StorageKey))
			return BadRequest(new { error = "StorageKey is required" });

		try
		{
			return Ok(new { storageKey = request.StorageKey, mediaType = "video", mediaContentType = AllowedContentType });
		}
		catch (Exception ex)
		{
			return StatusCode(500, new { error = "Failed to complete upload", details = ex.Message });
		}
	}

	[HttpGet("download-url")]
	public IActionResult GetDownloadUrl([FromQuery] string storageKey)
	{
		if (string.IsNullOrWhiteSpace(storageKey))
			return BadRequest(new { error = "Missing storageKey parameter" });

		try
		{
			var url = _storageService.GeneratePresignedDownloadUrl(storageKey);
			return Ok(new { storageKey, url });
		}
		catch (Exception ex)
		{
			return StatusCode(500, new { error = "Failed to generate download URL", details = ex.Message });
		}
	}
}
