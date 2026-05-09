using Microsoft.EntityFrameworkCore;
using BlogCMS.Api.Entities;

namespace BlogCMS.Api.Data;

public class BlogDbContext : DbContext
{
    public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options)
    {
    }

    public DbSet<Article> Articles { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<PublishJob> PublishJobs { get; set; }
    public DbSet<Media> Media { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasIndex(a => a.Slug).IsUnique();
            entity.HasIndex(a => a.Status);
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasIndex(a => a.Username).IsUnique();
        });

        modelBuilder.Entity<PublishJob>(entity =>
        {
            entity.HasIndex(j => j.Status);
            entity.HasOne(j => j.Article)
                  .WithMany()
                  .HasForeignKey(j => j.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasIndex(m => m.FileName);
        });
    }
}

public static class DbSeeder
{
    public static async Task SeedAsync(BlogDbContext context)
    {
        // Check if admin exists
        if (context.Admins.Any())
        {
            return;
        }

        // Create default admin: admin/admin123
        var admin = new Admin
        {
            Username = "admin",
            DisplayName = "Administrator",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Email = "admin@example.com",
            CreatedAt = DateTime.UtcNow
        };

        context.Admins.Add(admin);
        await context.SaveChangesAsync();
    }
}
