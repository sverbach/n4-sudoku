using System.Text.Json;

namespace Sudoku.Api.Models;

public class Share
{
    public string Id { get; set; } = default!;
    public JsonDocument GameState { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
