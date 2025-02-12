using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SocialMedia.DataAccess.Identity;

namespace MenuVoting.DataAccess.Models.SeedRoles
{
    public class RoleInitializer
    {
        public static async Task SeedRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetService<RoleManager<ApplicationRole>>();
            //var userManager = sAcope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            string[] roles = new string[] { "Admin", "User" };

            foreach (string role in roles)
            {
                var roleExists = await roleManager.RoleExistsAsync(role);

                if (!roleExists)
                {
                    await roleManager.CreateAsync(new ApplicationRole() { Name = role });
                }
            }
        }

        public static async Task SeedAdminUsers(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();

            // Define admin credentials
            var adminEmail = "admin@gmail.com";
            var adminPassword = "abcdef";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser { UserName = adminEmail, Email = adminEmail };
                var result = await userManager.CreateAsync(adminUser, adminPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }

    }
}
