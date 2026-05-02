$exe = Join-Path $env:USERPROFILE 'Downloads\TE2-2.28-portable\TabularEditor.exe'
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $exe
$psi.WorkingDirectory = Split-Path $exe
$psi.UseShellExecute = $false
$psi.EnvironmentVariables['COMPlus_EnableAMSI'] = '0'
$psi.EnvironmentVariables['DOTNET_EnableAMSI'] = '0'
$p = [System.Diagnostics.Process]::Start($psi)
Start-Sleep -Seconds 10
$alive = Get-Process -Id $p.Id -EA 0
if ($alive) {
  "RUNNING. PID=$($p.Id), Title='$($alive.MainWindowTitle)', Mem=$([int]($alive.WorkingSet64/1MB))MB"
} else {
  "EXITED"
}
