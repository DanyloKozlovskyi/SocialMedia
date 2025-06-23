using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.BusinessLogic.Services.Blogs.Options;
public class LuaScriptOptions
{
	public string ScriptsFolder { get; set; } = "Scripts";
	public string RescoreTopNFile { get; set; } = "rescore_top_n.lua";
	public string RetrieveTopNFile { get; set; } = "retrieve_top_n.lua";
}

