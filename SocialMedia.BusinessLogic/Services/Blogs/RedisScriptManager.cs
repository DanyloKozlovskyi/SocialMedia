using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using SocialMedia.BusinessLogic.Services.Blogs.Options;
using StackExchange.Redis;
using System.Diagnostics;

namespace SocialMedia.BusinessLogic.Services.Blogs;

public class RedisScriptManager
{
	private readonly IConnectionMultiplexer _mux;
	private readonly string _rescoreScript;
	private readonly string _luaText;
	private readonly string _resourceName;
	public RedisScriptManager(IConnectionMultiplexer mux, IOptions<LuaScriptOptions> luaOptions)
	{
		_mux = mux;

		var opts = luaOptions.Value;

		var assembly = typeof(RedisScriptManager).Assembly;
		_resourceName = assembly.GetManifestResourceNames().SingleOrDefault(n => n.EndsWith("Scripts.rescore_top_n.lua", StringComparison.Ordinal));

		_resourceName = assembly
			.GetManifestResourceNames()
			.SingleOrDefault(n => n.EndsWith("Scripts.rescore_top_n.lua", StringComparison.Ordinal));
		if (_resourceName == null)
			throw new FileNotFoundException(
				"Embedded Lua script not found. " +
				"Make sure 'rescore_top_n.lua' is set as an Embedded Resource under Scripts/.");

		using (var stream = assembly.GetManifestResourceStream(_resourceName))
		using (var reader = new StreamReader(stream!))
		{
			_luaText = reader.ReadToEnd();
		}

		foreach (var endpoint in _mux.GetEndPoints())
		{
			var server = _mux.GetServer(endpoint);
			if (!server.IsReplica)
			{
				server.ScriptLoad(_luaText);
			}
		}
	}

	/// <summary>
	/// Executes the RescoreTopN Lua script asynchronously, given keys and args.
	/// </summary>
	public async Task<RedisResult> ExecuteRescoreTopNAsync(RedisKey[] keys, RedisValue[] values)
	{
		var db = _mux.GetDatabase();
		try
		{
			return await db.ScriptEvaluateAsync(_luaText, keys: keys, values: values);
		}
		catch (RedisServerException ex) when (ex.Message.StartsWith("NOSCRIPT", StringComparison.OrdinalIgnoreCase))
		{
			foreach (var endpoint in _mux.GetEndPoints())
			{
				var server = _mux.GetServer(endpoint);
				if (!server.IsReplica)
				{
					server.ScriptLoad(_luaText);
				}
			}
			return await db.ScriptEvaluateAsync(_luaText, keys: keys, values: values);
		}
	}
}

