# Rebuilds assets/photos/manifest.json from images in that folder.
# File names: 2-*.jpg, 11-*.jpg, 2floor_*.jpg, 11floor_*.jpg (site infers floor).
$ErrorActionPreference = "Stop"
$repoRoot = Split-Path $PSScriptRoot -Parent
$here = Join-Path $repoRoot "assets\photos"
if (-not (Test-Path $here)) {
  Write-Error "Folder not found: $here"
}
$prefix = "assets/photos"
$ext = @(".jpg", ".jpeg", ".png", ".webp", ".gif")
$list = @()

Get-ChildItem -LiteralPath $here -File | Where-Object {
  $ext -contains $_.Extension.ToLower() -and $_.Name -ne "manifest.json"
} | Sort-Object Name | ForEach-Object {
  $name = $_.Name
  $rel = "$prefix/$name"
  $base = [System.IO.Path]::GetFileNameWithoutExtension($name)
  $alt = $base -replace "^11[-_\s]+", "" -replace "^2[-_\s]+", ""
  if ([string]::IsNullOrWhiteSpace($alt)) { $alt = $base }
  $list += [ordered]@{ src = $rel; alt = $alt }
}

$obj = [ordered]@{ photos = $list }
$json = ($obj | ConvertTo-Json -Depth 5)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$out = Join-Path $here "manifest.json"
[System.IO.File]::WriteAllText($out, $json + "`n", $utf8NoBom)
Write-Host "OK: $($list.Count) photo(s) -> $out"
