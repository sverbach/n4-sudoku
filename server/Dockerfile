FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/Sudoku.Api/Sudoku.Api.csproj", "src/Sudoku.Api/"]
RUN dotnet restore "src/Sudoku.Api/Sudoku.Api.csproj"
COPY . .
RUN dotnet publish "src/Sudoku.Api/Sudoku.Api.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Sudoku.Api.dll"]
