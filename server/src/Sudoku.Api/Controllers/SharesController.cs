using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Sudoku.Api.Data;
using Sudoku.Api.Helpers;
using Sudoku.Api.Models;

namespace Sudoku.Api.Controllers;

[ApiController]
[Route("api/shares")]
public class SharesController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateShare([FromBody] CreateShareRequest request)
    {
        if (request.GameState == null)
            return BadRequest("gameState is required");

        var id = IdGenerator.Generate();
        var share = new Share
        {
            Id = id,
            GameState = JsonDocument.Parse(JsonSerializer.Serialize(request.GameState)),
            CreatedAt = DateTime.UtcNow
        };

        db.Shares.Add(share);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShare), new { id }, new { id });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetShare(string id)
    {
        var share = await db.Shares.FindAsync(id);
        if (share == null)
            return NotFound();

        return Ok(new { gameState = share.GameState });
    }
}

public class CreateShareRequest
{
    public JsonElement? GameState { get; set; }
}
