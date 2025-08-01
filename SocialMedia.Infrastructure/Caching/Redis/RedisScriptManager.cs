﻿using Microsoft.Extensions.Options;
using SocialMedia.Application.Options;
using StackExchange.Redis;

namespace SocialMedia.Infrastructure.Caching.Redis;
public class RedisScriptManager
{
	private readonly IConnectionMultiplexer _mux;
	private readonly LuaScriptOptions _luaOptions;
	private const string POSTS_NAMESPACE = "posts:*";
	public RedisScriptManager(IConnectionMultiplexer mux, IOptions<LuaScriptOptions> luaOptions)
	{
		_mux = mux;
		_luaOptions = luaOptions.Value;
	}
	/// <summary>
	/// Executes the RescoreTopN Lua script asynchronously, given keys and args.
	/// </summary>
	public async Task ExecuteRescoreTopNAsync(RedisValue[] values)
	{
		var scriptPath = _luaOptions.ScriptsFolder + "." + _luaOptions.RescoreTopNFile;
		var result = await ExecuteScriptAtPathAsync(scriptPath, keys: Array.Empty<RedisKey>(), values);
	}
	public async Task<List<Guid>> ExecuteRetrieveTopNAsync(RedisValue[] values)
	{
		var scriptPath = _luaOptions.ScriptsFolder + "." + _luaOptions.RetrieveTopNFile;
		var raw = (RedisValue[])await ExecuteScriptAtPathAsync(scriptPath, keys: Array.Empty<RedisKey>(), values);
		var guids = raw.Select(v => Guid.Parse(v)).ToList();
		return guids;

	}
	public async Task ExecuteClearAsync()
	{
		var server = GetServer();

		var db = _mux.GetDatabase();

		await foreach (var key in server.KeysAsync(
			database: db.Database,
			pattern: POSTS_NAMESPACE,
			pageSize: 500))
		{
			await db.KeyDeleteAsync(key).ConfigureAwait(false);
		}
	}
	private IServer GetServer()
	{
		var endpoint = _mux.GetEndPoints().FirstOrDefault()
					   ?? throw new InvalidOperationException("No endpoints configured on the multiplexer.");

		return _mux.GetServer(endpoint);
	}
	private async Task<RedisResult> ExecuteScriptAtPathAsync(string scriptPath, RedisKey[] keys, RedisValue[] values)
	{
		var luaQuery = GetLuaQuery(scriptPath);
		var result = await ExecuteQueryAsync(luaQuery, keys, values);
		return result;
	}
	private string GetLuaQuery(string scriptPath = "Scripts.rescore_top_n.lua")
	{
		var assembly = typeof(RedisScriptManager).Assembly;
		var resourceName = assembly.GetManifestResourceNames().SingleOrDefault(n => n.EndsWith(scriptPath, StringComparison.Ordinal));
		if (resourceName == null)
			throw new FileNotFoundException(
				"Embedded Lua script not found. " +
				$"Make sure '{scriptPath}.lua' is set as an Embedded Resource under Scripts/.");

		string luaQuery = string.Empty;
		using (var stream = assembly.GetManifestResourceStream(resourceName))
		using (var reader = new StreamReader(stream!))
		{
			luaQuery = reader.ReadToEnd();
		}

		foreach (var endpoint in _mux.GetEndPoints())
		{
			var server = _mux.GetServer(endpoint);
			if (!server.IsReplica)
			{
				server.ScriptLoad(luaQuery);
			}
		}
		return luaQuery;
	}
	private async Task<RedisResult> ExecuteQueryAsync(string luaQuery, RedisKey[] keys, RedisValue[] values)
	{
		var db = _mux.GetDatabase();
		try
		{
			return await db.ScriptEvaluateAsync(luaQuery, keys: keys, values: values);
		}
		catch (RedisServerException ex) when (ex.Message.StartsWith("NOSCRIPT", StringComparison.OrdinalIgnoreCase))
		{
			foreach (var endpoint in _mux.GetEndPoints())
			{
				var server = _mux.GetServer(endpoint);
				if (!server.IsReplica)
				{
					server.ScriptLoad(luaQuery);
				}
			}
			return await db.ScriptEvaluateAsync(luaQuery, keys: keys, values: values);
		}
	}
}

