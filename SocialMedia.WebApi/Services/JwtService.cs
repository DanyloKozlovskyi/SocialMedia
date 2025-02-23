using SocialMedia.WebApi.Dtos.Identity;
using SocialMedia.DataAccess.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SocialMedia.WebApi.Services
{
    public class JwtService : IJwtService
    {
        //to read Jwt configuration from appsettings.json
        private readonly IConfiguration configuration;
        // size of key must be greater than 256 bites
        private readonly string key;

        public JwtService(IConfiguration config)
        {
            configuration = config;
            key = configuration["Jwt:Key"];
        }

        public AuthenticationResponse CreateJwtToken(ApplicationUser user)
        {
            DateTime expiration = DateTime.UtcNow.AddMinutes(Convert.ToDouble(configuration["Jwt:EXPIRATION_MINUTES"]));

            Claim[] claims = new Claim[]
                {
					//JwtRegisteredClaimNames.Sub - user identity
					new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
					//JwtRegisteredClaimNames.Jti - unique id for the token
					new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
					//JwtRegisteredClaimNames.Iat - issued at
					//couldn't authorize if iat is string it must be int
					new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.Now.ToUnixTimeSeconds().ToString()),
					// further fields are optional
					new Claim(ClaimTypes.NameIdentifier, user.Email),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email, user.Email)
                };

            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            SigningCredentials signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            JwtSecurityToken tokenGenerator = new JwtSecurityToken(
                configuration["JWT:Issuer"],
                configuration["JWT:Audience"],
                claims,
                expires: expiration,
                signingCredentials: signingCredentials
                );

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            //possible error here if key size is less than 256 bytes 
            string token = tokenHandler.WriteToken(tokenGenerator);

            Console.WriteLine(Convert.ToInt32(configuration["Jwt:EXPIRATION_MINUTES"]));

            return new AuthenticationResponse()
            {
                Token = token,
                Email = user.Email,
                UserName = user.UserName,
                Expiration = expiration,
                RefreshToken = GenerateRefreshToken(),
                //*here I changed Utc to UtcNow
                RefreshTokenExpirationDateTime = DateTime.UtcNow.AddMinutes(Convert.ToInt32(configuration["Jwt:EXPIRATION_MINUTES"]))
            };
        }

        //Creates a refresh token (base 64 string of random numbers)
        private string GenerateRefreshToken()
        {
            byte[] bytes = new byte[64];
            var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public ClaimsPrincipal? GetPrincipalFromJwtToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidateActor = true,
                ValidAudience = configuration["Jwt:Audience"],
                ValidateIssuer = true,
                ValidIssuer = configuration["Jwt:Issuer"],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),

                //method called when token is expired
                ValidateLifetime = false,
            };

            JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();

            try
            {
                ClaimsPrincipal principal1 = jwtSecurityTokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken1);
            }
            catch (Exception exc)
            {
                Console.WriteLine(exc.Message);
            }

            ClaimsPrincipal principal = jwtSecurityTokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            if (securityToken is not JwtSecurityToken jwtSecurityToken ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }
    }
}