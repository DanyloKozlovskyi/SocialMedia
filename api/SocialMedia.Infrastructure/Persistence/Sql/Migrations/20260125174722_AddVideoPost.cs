using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVideoPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageKey",
                table: "Blogs",
                newName: "MediaKey");
            migrationBuilder.RenameColumn(
                name: "ImageContentType",
                table: "Blogs",
                newName: "MediaContentType");
            migrationBuilder.AddColumn<string>(
                name: "MediaType",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);
            migrationBuilder.Sql(
                "UPDATE Blogs SET MediaType = 'image' WHERE MediaKey IS NOT NULL AND MediaType IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaType",
                table: "Blogs");

            migrationBuilder.RenameColumn(
                name: "MediaKey",
                table: "Blogs",
                newName: "ImageKey");

            migrationBuilder.RenameColumn(
                name: "MediaContentType",
                table: "Blogs",
                newName: "ImageContentType");
        }
    }
}
