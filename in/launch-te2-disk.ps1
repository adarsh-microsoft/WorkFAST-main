if (Test-Path "$env:LOCALAPPDATA\TabularEditor") {
    Remove-Item "$env:LOCALAPPDATA\TabularEditor" -Recurse -Force
}
$exe = "$env:USERPROFILE\Downloads\TE2-2.28-portable\TabularEditor.exe"
$p = Start-Process -FilePath $exe -PassThru
Start-Sleep -Seconds 12
$alive = Get-Process -Id $p.Id -EA 0
if ($alive) {
    "RUNNING. PID=$($p.Id), Title='$($alive.MainWindowTitle)', Mem=$([int]($alive.WorkingSet64/1MB))MB"
} else {
    "EXITED"
    Get-WinEvent -FilterHashtable @{LogName='Application'; StartTime=(Get-Date).AddMinutes(-2); ProviderName='.NET Runtime'} -EA 0 |
        Sort-Object TimeCreated -Descending | Select-Object -First 1 |
        ForEach-Object { $_.Message.Substring(0,[Math]::Min(1000,$_.Message.Length)) }
}
