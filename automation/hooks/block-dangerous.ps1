param()

$inputJson = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($inputJson)) {
  exit 0
}

try {
  $payload = $inputJson | ConvertFrom-Json
} catch {
  exit 0
}

$command = ""
if ($payload.tool_input -and $payload.tool_input.command) {
  $command = [string]$payload.tool_input.command
}

$blocked = @(
  "git reset --hard",
  "rm -rf",
  "del /f /s /q",
  "Remove-Item -Recurse -Force"
)

foreach ($pattern in $blocked) {
  if ($command -like "*$pattern*") {
    Write-Output "Blocked by hook: dangerous command pattern '$pattern'."
    exit 2
  }
}

exit 0
