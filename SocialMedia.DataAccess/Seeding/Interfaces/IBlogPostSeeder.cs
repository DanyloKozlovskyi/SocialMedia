using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Seeding.Interfaces;
public interface IBlogPostSeeder
{
    Task SeedAsync(int targetCount = 300, CancellationToken ct = default);
}

