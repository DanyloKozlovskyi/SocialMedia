using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMedia.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddParentToBlogPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ParentId",
                table: "Blogs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_ParentId",
                table: "Blogs",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_Blogs_ParentId",
                table: "Blogs",
                column: "ParentId",
                principalTable: "Blogs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_Blogs_ParentId",
                table: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_Blogs_ParentId",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "Blogs");
        }
    }
}
