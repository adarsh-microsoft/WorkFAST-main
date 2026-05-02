$exe = "$env:USERPROFILE\Downloads\TE2-2.28-portable\TabularEditor.exe"
$desktop = [Environment]::GetFolderPath('Desktop')
$lnkPath = Join-Path $desktop 'Tabular Editor 2.lnk'

$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($lnkPath)
$sc.TargetPath = $exe
$sc.WorkingDirectory = Split-Path $exe
$sc.IconLocation = "$exe,0"
$sc.Description  = 'Tabular Editor 2.28.0 (portable, Costura-extracted)'
$sc.Save()

Write-Host "Shortcut created: $lnkPath"
Start-Process -FilePath $exe
Start-Sleep -Seconds 8
$p = Get-Process -Name TabularEditor -EA 0 | Select-Object -First 1
if ($p) {
    "RUNNING. PID=$($p.Id), Title='$($p.MainWindowTitle)', Mem=$([int]($p.WorkingSet64/1MB))MB"
} else {
    "Failed to start"
}
