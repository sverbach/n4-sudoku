using System.Security.Cryptography;

namespace Sudoku.Api.Helpers;

public static class IdGenerator
{
    private const string Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private const int IdLength = 8;

    public static string Generate()
    {
        var bytes = new byte[IdLength];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(bytes);
        }

        var id = new char[IdLength];
        for (int i = 0; i < IdLength; i++)
        {
            id[i] = Alphabet[bytes[i] % Alphabet.Length];
        }

        return new string(id);
    }
}
