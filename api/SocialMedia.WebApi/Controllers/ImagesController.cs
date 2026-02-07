using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.Application.Images;

namespace SocialMedia.WebApi.Controllers;
[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ImagesController : ControllerBase
{
	private readonly IImageService _imageService;

	public ImagesController(IImageService imageService)
	{
		_imageService = imageService;
	}

	[HttpGet("upload-url")]
	public IActionResult GetUploadUrl([FromQuery] string fileName)
	{
		var (key, uploadUrl, contentType) = _imageService.GetUploadUrl(fileName);
		return Ok(new { key, uploadUrl, contentType });
	}

	[HttpGet("{*key}")]
	public async Task<IActionResult> Download(string key)
	{
		string decodedKey = Uri.UnescapeDataString(key);
		var downloadResult = await _imageService.DownloadImageAsync(decodedKey);
		if (downloadResult == null)
			return NotFound();

		return File(downloadResult.ImageStream, downloadResult.ContentType ?? "application/octet-stream");
	}

	[HttpDelete("{key}")]
	public async Task<IActionResult> Delete(string key)
	{
		await _imageService.DeleteImageAsync(key);
		return NoContent();
	}

	[HttpGet("download-url")]
	public IActionResult GetDownloadUrl([FromQuery] string key)
	{
		if (string.IsNullOrEmpty(key))
			return BadRequest(new { error = "Missing `key` parameter" });

		var url = _imageService.GetDownloadUrl(key);
		return Ok(new { key, url });
	}

	[HttpGet("validate-content")]
	public async Task<IActionResult> ValidateContent([FromQuery] string key)
	{
		if (string.IsNullOrWhiteSpace(key))
			return BadRequest(new { error = "Missing `key` parameter" });

		bool isValid;
		try
		{
			isValid = await _imageService.ValidateContentAsync(key);
		}
		catch (Exception ex)
		{
			return StatusCode(500, new { error = "Validation failed", details = ex.Message });
		}

		return Ok(new { key, isValid });
	}

	[HttpGet("upload-url/blog")]
	public IActionResult GetUploadBlogUrl([FromQuery] string fileName)
	{
		var (key, uploadUrl, contentType) = _imageService.GetUploadUrlForBlog(fileName);
		return Ok(new { key, uploadUrl, contentType });
	}

	[HttpGet("upload-url/logo")]
	public IActionResult GetUploadLogoUrl([FromQuery] string fileName)
	{
		var (key, uploadUrl, contentType) = _imageService.GetUploadUrlForLogo(fileName);
		return Ok(new { key, uploadUrl, contentType });
	}
}