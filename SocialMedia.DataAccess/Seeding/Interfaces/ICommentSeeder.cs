using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialMedia.DataAccess.Seeding.Interfaces;
public interface ICommentSeeder
{
    Task SeedAsync(CancellationToken ct = default);
}