using Microsoft.EntityFrameworkCore;
using Sudoku.Api.Models;

namespace Sudoku.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Share> Shares { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Share>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.GameState).HasColumnType("jsonb");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .ValueGeneratedOnAdd();
        });
    }
}
