$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$apiScript = Join-Path $PSScriptRoot "start-blogcms-api.ps1"
$adminWorkdir = Join-Path $repoRoot "src\BlogCMS.Admin"

& $apiScript

$adminListener = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -eq 3002 } |
  Select-Object -First 1

if (-not $adminListener) {
  Start-Process powershell `
    -WorkingDirectory $adminWorkdir `
    -ArgumentList "-NoLogo", "-NoProfile", "-Command", "npm run dev" `
    -WindowStyle Hidden | Out-Null

  Start-Sleep -Seconds 3
}

Write-Host "BlogCMS Admin should be available on http://localhost:3002"
Write-Host "BlogCMS API should be available on http://localhost:5000"
