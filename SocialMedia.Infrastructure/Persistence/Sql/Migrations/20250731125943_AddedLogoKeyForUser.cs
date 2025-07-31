using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedLogoKeyForUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LogoContentType",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoKey",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LogoContentType",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LogoKey",
                table: "AspNetUsers");
        }
    }
}
