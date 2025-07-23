using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMedia.Application.Images;

namespace SocialMedia.WebApi.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ImagesController : ControllerBase
{
	private readonly IImageService _imageService;

	public ImagesController(IImageService imageService)
	{
		_imageService = imageService;
	}

	[HttpGet("upload-url")]
	[AllowAnonymous]
	public IActionResult GetUploadUrl([FromQuery] string fileName)
	{
		var (key, uploadUrl, contentType) = _imageService.GetUploadUrl(fileName);
		return Ok(new { key, uploadUrl, contentType });
	}

	[HttpGet("{*key}")]
	[AllowAnonymous]
	public async Task<IActionResult> Download(string key)
	{
		string decodedKey = Uri.UnescapeDataString(key);
		var stream = await _imageService.DownloadImageAsync(decodedKey);
		if (stream == null)
			return NotFound();

		// Optionally infer content type from key extension
		return File(stream, "application/octet-stream");
	}

	[HttpDelete("{key}")]
	public async Task<IActionResult> Delete(string key)
	{
		await _imageService.DeleteImageAsync(key);
		return NoContent();
	}
}