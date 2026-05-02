if (Test-Path "$env:LOCALAPPDATA\TabularEditor") {
    Remove-Item "$env:LOCALAPPDATA\TabularEditor" -Recurse -Force
    "Cleared user cache"
}
$exe = "$env:USERPROFILE\Downloads\TE2-2.28-portable\TabularEditor.exe"
$p = Start-Process -FilePath $exe -PassThru
Start-Sleep -Seconds 8
$alive = Get-Process -Id $p.Id -EA 0
if ($alive) {
    "RUNNING. PID=$($p.Id), Title='$($alive.MainWindowTitle)', Mem=$([int]($alive.WorkingSet64/1MB))MB"
} else {
    "EXITED"
}
