$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$apiProject = Join-Path $repoRoot "src\BlogCMS.Api\BlogCMS.Api.csproj"
$apiWorkdir = Split-Path -Parent $apiProject
$logPath = Join-Path $apiWorkdir "api-dev.log"
$errLogPath = Join-Path $apiWorkdir "api-dev.err.log"

$listener = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -eq 5000 } |
  Select-Object -First 1

if ($listener) {
  Write-Host "BlogCMS.Api is already listening on port 5000."
  exit 0
}

if (Test-Path $logPath) {
  Remove-Item $logPath -Force
}

if (Test-Path $errLogPath) {
  Remove-Item $errLogPath -Force
}

$command = "cd /d `"$apiWorkdir`" && dotnet run --urls http://0.0.0.0:5000 1>`"$logPath`" 2>`"$errLogPath`""

$process = Start-Process cmd.exe `
  -ArgumentList "/c", $command `
  -WindowStyle Hidden `
  -PassThru

$started = $null
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Milliseconds 500

  $started = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $_.LocalPort -eq 5000 } |
    Select-Object -First 1

  if ($started) {
    break
  }

  if ($process.HasExited) {
    break
  }
}

if (-not $started) {
  Write-Error "BlogCMS.Api failed to start. Check $logPath and $errLogPath for details."
}

Write-Host "BlogCMS.Api started on http://localhost:5000"
