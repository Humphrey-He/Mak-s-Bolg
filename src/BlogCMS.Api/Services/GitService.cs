using System.Diagnostics;

namespace BlogCMS.Api.Services;

public class GitService
{
    private readonly string _repoPath;
    private readonly string? _token;
    private readonly string _owner;
    private readonly string _repo;

    public GitService(IConfiguration configuration)
    {
        _repoPath = configuration["Git:RepoPath"] ?? Directory.GetCurrentDirectory();
        _token = configuration["GitHub:Token"];
        _owner = configuration["GitHub:Owner"] ?? "";
        _repo = configuration["GitHub:Repo"] ?? "";
    }

    public async Task<(bool success, string message, string? commitSha)> PullAsync()
    {
        try
        {
            var result = await RunGitCommand("pull origin main");
            if (result.exitCode != 0)
            {
                return (false, result.output + result.error, null);
            }
            return (true, "Pull successful", null);
        }
        catch (Exception ex)
        {
            return (false, ex.Message, null);
        }
    }

    public async Task<(bool success, string message, string? commitSha)> CommitAndPushAsync(string filePath, string message)
    {
        try
        {
            // Configure remote with token before any operation
            if (!string.IsNullOrEmpty(_token))
            {
                var remoteResult = await RunGitCommand($"remote set-url origin https://x-access-token:{_token}@github.com/{_owner}/{_repo}.git");
            }

            // git add
            var addResult = await RunGitCommand($"add \"{filePath}\"");
            if (addResult.exitCode != 0)
            {
                return (false, $"git add failed: {addResult.error}", null);
            }

            // git commit
            var commitResult = await RunGitCommand($"commit -m \"{message}\"");
            if (commitResult.exitCode != 0)
            {
                return (false, $"git commit failed: {commitResult.error}", null);
            }

            // Extract commit SHA
            var sha = commitResult.output.Split('\n')
                .FirstOrDefault(line => line.Contains("commit"))
                ?.Split(' ').LastOrDefault() ?? "";

            // git push
            var pushResult = await RunGitCommand("push origin main");
            if (pushResult.exitCode != 0)
            {
                return (false, $"git push failed: {pushResult.error}", sha);
            }

            return (true, "Push successful", sha);
        }
        catch (Exception ex)
        {
            return (false, ex.Message, null);
        }
    }

    public async Task<(bool success, string message)> DeleteFileAsync(string filePath, string message)
    {
        try
        {
            // Configure remote with token
            if (!string.IsNullOrEmpty(_token))
            {
                await RunGitCommand($"remote set-url origin https://x-access-token:{_token}@github.com/{_owner}/{_repo}.git");
            }

            var addResult = await RunGitCommand($"rm \"{filePath}\"");
            if (addResult.exitCode != 0)
            {
                return (false, $"git rm failed: {addResult.error}");
            }

            var commitResult = await RunGitCommand($"commit -m \"{message}\"");
            if (commitResult.exitCode != 0)
            {
                return (false, $"git commit failed: {commitResult.error}");
            }

            var pushResult = await RunGitCommand("push origin main");
            if (pushResult.exitCode != 0)
            {
                return (false, $"git push failed: {pushResult.error}");
            }

            return (true, "File deleted and pushed");
        }
        catch (Exception ex)
        {
            return (false, ex.Message);
        }
    }

    private async Task<(int exitCode, string output, string error)> RunGitCommand(string args)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "git",
                Arguments = args,
                WorkingDirectory = _repoPath,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                Environment =
                {
                    ["GIT_TERMINAL_PROMPT"] = "0"
                }
            }
        };

        process.Start();

        var output = await process.StandardOutput.ReadToEndAsync();
        var error = await process.StandardError.ReadToEndAsync();

        await process.WaitForExitAsync();

        return (process.ExitCode, output, error);
    }
}
