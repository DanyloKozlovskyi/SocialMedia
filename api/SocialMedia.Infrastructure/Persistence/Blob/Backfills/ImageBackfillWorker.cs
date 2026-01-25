using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace SocialMedia.Infrastructure.Persistence.Blob.Backfills;
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
		if (!_cfg.GetValue<bool>("RunImageBackfillLogo")) return;

		using var scope = _sp.CreateScope();
		//var job = scope.ServiceProvider.GetRequiredService<ImageBackfill>();
		var job = scope.ServiceProvider.GetRequiredService<LogoBackfillService>();
		await job.RunAsync(stoppingToken);
	}
}
