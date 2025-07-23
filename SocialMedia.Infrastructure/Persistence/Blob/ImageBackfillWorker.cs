using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SocialMedia.Application.Images;

namespace SocialMedia.Infrastructure.Persistence.Blob;
public class ImageBackfillWorker : BackgroundService
{
	private readonly IServiceProvider _sp;
	private readonly IConfiguration _cfg;

	public ImageBackfillWorker(IServiceProvider sp, IConfiguration cfg)
	{
		_sp = sp; _cfg = cfg;
	}

	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		if (!_cfg.GetValue<bool>("RunImageBackfill")) return;

		using var scope = _sp.CreateScope();
		var job = scope.ServiceProvider.GetRequiredService<ImageBackfill>();
		await job.RunAsync(stoppingToken);
	}
}
