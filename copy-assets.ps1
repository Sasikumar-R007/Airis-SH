# PowerShell script to copy assets to public folder
# Run this script to move assets from src/assests to public/assets

$sourceDir = "src\assests"
$destDir = "public\assets"

if (Test-Path $sourceDir) {
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force
    }
    Copy-Item -Path "$sourceDir\*" -Destination $destDir -Recurse -Force
    Write-Host "Assets copied successfully to public/assets"
} else {
    Write-Host "Source directory not found: $sourceDir"
}

