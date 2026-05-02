$exe = Join-Path $env:USERPROFILE 'Downloads\TE2-2.28-portable\TabularEditor.exe'
$dir = Split-Path $exe
Set-Location $dir

# Load assembly purely for resource extraction (no execution)
$asm = [Reflection.Assembly]::ReflectionOnlyLoadFrom($exe)
$names = $asm.GetManifestResourceNames() | Where-Object { $_ -match '^costura\.' -and $_ -match '\.compressed$' }
Write-Host "Embedded Costura compressed assemblies: $($names.Count)"

foreach ($name in $names) {
    # Names look like: costura.tomwrapper.dll.compressed
    $stem = $name -replace '^costura\.', '' -replace '\.compressed$', ''
    $outPath = Join-Path $dir $stem
    if (Test-Path $outPath) {
        Write-Host "SKIP exists: $stem"
        continue
    }
    $rs = $asm.GetManifestResourceStream($name)
    if (-not $rs) { Write-Host "no stream: $name"; continue }
    # Decompress (DeflateStream)
    $ds = New-Object System.IO.Compression.DeflateStream($rs, [System.IO.Compression.CompressionMode]::Decompress)
    $ms = New-Object System.IO.MemoryStream
    $ds.CopyTo($ms)
    [System.IO.File]::WriteAllBytes($outPath, $ms.ToArray())
    $ds.Dispose(); $rs.Dispose(); $ms.Dispose()
    Write-Host "EXTRACTED: $stem  ($([int]($ms.Length/1KB)) KB)"
}
Write-Host "Done. Files now in $dir :"
Get-ChildItem $dir -Filter *.dll | Select-Object Name, Length | Format-Table -AutoSize
