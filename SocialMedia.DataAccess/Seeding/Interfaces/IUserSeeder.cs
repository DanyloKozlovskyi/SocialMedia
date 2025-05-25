using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Seeding.Interfaces;
public interface IUserSeeder
{
    Task SeedAsync(CancellationToken ct = default);
}
