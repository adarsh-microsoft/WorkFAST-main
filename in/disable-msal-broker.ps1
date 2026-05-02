$d = "$env:USERPROFILE\Downloads\TE2-2.28-portable"
$broker = @('Microsoft.Identity.Client.Broker.dll','Microsoft.Identity.Client.NativeInterop.dll','runtimes')
$dest = Join-Path $d '_broker_disabled'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
foreach ($b in $broker) {
    $src = Join-Path $d $b
    if (Test-Path $src) {
        Move-Item -LiteralPath $src -Destination $dest -Force
        "Moved aside: $b"
    } else {
        "Not present: $b"
    }
}
Write-Host "--- Remaining files in $d ---"
Get-ChildItem $d -File | Select-Object Name | Format-Table -AutoSize
