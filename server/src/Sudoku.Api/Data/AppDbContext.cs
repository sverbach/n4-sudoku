using Microsoft.EntityFrameworkCore;

namespace Sudoku.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // DbSets will be added as game entities are introduced
}
