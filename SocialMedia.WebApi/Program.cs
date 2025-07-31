using Amazon.Runtime;
using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SocialMedia.Application;
using SocialMedia.Application.BlogPosts;
using SocialMedia.Application.Identity;
using SocialMedia.Application.Images;
using SocialMedia.Application.Options;
using SocialMedia.Application.Utilities;
using SocialMedia.Domain.Entities.Identity;
using SocialMedia.Infrastructure.Caching.Redis;
using SocialMedia.Infrastructure.Persistence.Blob;
using SocialMedia.Infrastructure.Persistence.Sql;
using SocialMedia.Infrastructure.Persistence.Sql.Repositories;
using SocialMedia.Infrastructure.Persistence.Sql.Seeders.BlogPosts;
using SocialMedia.Infrastructure.Persistence.Sql.Seeders.Comments;
using SocialMedia.Infrastructure.Persistence.Sql.Seeders.Likes;
using SocialMedia.Infrastructure.Persistence.Sql.Seeders.Roles;
using SocialMedia.Infrastructure.Persistence.Sql.Seeders.Users;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

var accountId = Environment.GetEnvironmentVariable("CF_ACCOUNT_ID")!;
var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID")!;
var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")!;

// 3) Configure and register IAmazonS3
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
	var config = new AmazonS3Config
	{
		ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
		ForcePathStyle = true,
		AuthenticationRegion = "auto"   // R2 doesn’t use AWS regions
	};

	var creds = new BasicAWSCredentials(accessKey, secretKey);
	return new AmazonS3Client(creds, config);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers(options =>
{
	var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
	options.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddControllers();
builder.Services.AddDbContext<SocialMediaDbContext>(options =>
{
	options.UseSqlServer(builder.Configuration.GetConnectionString("Default"), opt => opt.CommandTimeout(60).UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)).EnableSensitiveDataLogging();
});

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
	options.Password.RequireDigit = false;
	options.Password.RequireNonAlphanumeric = false;
	options.Password.RequireUppercase = false;
}).AddEntityFrameworkStores<SocialMediaDbContext>()
.AddUserStore<UserStore<ApplicationUser, ApplicationRole, SocialMediaDbContext, Guid>>()
.AddRoleStore<RoleStore<ApplicationRole, SocialMediaDbContext, Guid>>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters()
	{
		ValidateAudience = true,
		ValidAudience = builder.Configuration["Jwt:Audience"],
		ValidateIssuer = true,
		ValidIssuer = builder.Configuration["Jwt:Issuer"],
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
	};
});

builder.Services.AddScoped<ImageBackfill>();
builder.Services.AddHostedService<ImageBackfillWorker>();

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo() { Title = "Social Media WebApi", Version = "1.0" });
});

builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policyBuilder =>
	{
		policyBuilder.WithOrigins("http://localhost:3000", "http://localhost:8000")
		.AllowAnyHeader()
		.AllowAnyMethod();
	});
});

builder.Services.AddScoped(typeof(IEntityRepository<,>), typeof(EntityRepository<,>));
builder.Services.AddScoped<IPostRankingCache, PostRankingCache>();
builder.Services.AddScoped<IBlogRepository, BlogRepositoryCacheDecorator>();
builder.Services.AddTransient<IJwtService, JwtService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IImageRepository, R2ImageRepository>();
builder.Services.AddScoped<IUploadUrlFactory, UploadUrlFactory>();
builder.Services.AddScoped<IImageService, ImageService>();

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.Configure<UserSeedOptions>(opt =>
{
	opt.AvatarsDirectory = Path.Combine(builder.Environment.WebRootPath, "avatars");
});
builder.Services.AddScoped<IUserSeeder, CsvUserSeeder>();

builder.Services.Configure<BlogPostSeedOptions>(opt =>
{
	opt.ImagesDirectory = Path.Combine(builder.Environment.WebRootPath, "posts");
	opt.ImagesCsvPath = Path.Combine(opt.ImagesDirectory, "labels.csv");
});

builder.Services.AddScoped<IBlogPostSeeder, BlogPostSeeder>();

builder.Services.Configure<CommentSeedOptions>(opt =>
{
	opt.ImagesDirectory = Path.Combine(builder.Environment.WebRootPath, "comment-images");
	opt.CommentCount = 800;
	opt.ImageProbability = 0.25;
});

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
	var configuration = builder.Configuration["Redis:ConnectionString"];
	return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddSingleton<PostRankingCache>();

builder.Services.Configure<LuaScriptOptions>(builder.Configuration.GetSection("LuaScriptOptions"));

builder.Services.AddSingleton<RedisScriptManager>();

builder.Services.AddScoped<ICommentSeeder, CommentSeeder>();

builder.Services.Configure<LikeSeedOptions>(opt =>
{
	opt.MinPerPost = 0;
	opt.MaxPerPost = 30;
});

builder.Services.AddScoped<ILikeSeeder, LikeSeeder>();

var app = builder.Build();

app.UseHsts();
app.UseRouting();

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(options =>
	{
		options.SwaggerEndpoint("/swagger/v1/swagger.json", "1.0");
	});
}

using (var scope = app.Services.CreateScope())
{
	try
	{
		await RoleInitializer.SeedRoles(scope.ServiceProvider);
	}
	catch (Exception exc)
	{
		Console.WriteLine(exc);
	}
}

using (var scope = app.Services.CreateScope())
{
	var seeder = scope.ServiceProvider.GetRequiredService<IUserSeeder>();
	await seeder.SeedAsync();
}

using (var scope = app.Services.CreateScope())
{
	await scope.ServiceProvider.GetRequiredService<IBlogPostSeeder>().SeedAsync(300);
	await scope.ServiceProvider.GetRequiredService<ICommentSeeder>().SeedAsync();
	await scope.ServiceProvider.GetRequiredService<ILikeSeeder>().SeedAsync();
}

app.Run();
