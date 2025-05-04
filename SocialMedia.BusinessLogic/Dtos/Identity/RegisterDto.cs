using MenuVoting.DataAccess.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocialMedia.WebApi.Dtos.Identity
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Person Name can't be blank")]
        public string UserName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email can't be blank")]
        [EmailAddress(ErrorMessage = "Email should be in a proper email address format")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Phone number can't be blank")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Phone number should contain digits only")]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password can't be blank")]
        public string Password { get; set; } = string.Empty;
        [Required(ErrorMessage = "Confirm Password can't be blank")]
        [Compare("Password", ErrorMessage = "Password and confirm password do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
        public string? Logo { get; set; }
        public string? Description { get; set; }
    }
}
