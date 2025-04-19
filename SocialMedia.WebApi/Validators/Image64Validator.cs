namespace SocialMedia.WebApi.Validators;
public static class Image64Validator
{
    public static bool ValidateImage64(string image64)
    {
        if (string.IsNullOrEmpty(image64))
            return false;

        return true;
    }
}

