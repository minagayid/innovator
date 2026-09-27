# Build InnovArt.exe and create a desktop shortcut.
# Usage:  .\build_exe.ps1   (run from the repo root; requires .venv with deps installed)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# PyInstaller logs to stderr; run through cmd so PowerShell doesn't treat that as an error.
cmd /c '.venv\Scripts\python.exe -m PyInstaller --noconfirm --onefile --noconsole --name InnovArt --icon assets\innovart.ico --add-data "server\static;server\static" --collect-submodules uvicorn desktop.py > build_pyinstaller.log 2>&1'
if ($LASTEXITCODE -ne 0) {
    Get-Content build_pyinstaller.log -Tail 30
    throw "PyInstaller failed (exit $LASTEXITCODE) - see build_pyinstaller.log"
}

if (-not (Test-Path .\dist\InnovArt.exe)) { throw "Build failed: dist\InnovArt.exe not found" }

# Desktop shortcut
$desktop = [Environment]::GetFolderPath("Desktop")
$ws = New-Object -ComObject WScript.Shell
$shortcut = $ws.CreateShortcut("$desktop\InnovArt.lnk")
$shortcut.TargetPath = (Resolve-Path .\dist\InnovArt.exe).Path
$shortcut.WorkingDirectory = (Resolve-Path .\dist).Path
$shortcut.IconLocation = (Resolve-Path .\assets\innovart.ico).Path
$shortcut.Description = "InnovArt - Innovation Command Center"
$shortcut.Save()

Write-Host "Built dist\InnovArt.exe and created desktop shortcut 'InnovArt'"
