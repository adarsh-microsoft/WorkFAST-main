param(
  [string]$TeDir = 'C:\Users\v-adevashish\Downloads\TabularEditor.2.26.0'
)
$ErrorActionPreference = 'Continue'
Set-Location $TeDir

# Hook resolve to log every attempted bind
[AppDomain]::CurrentDomain.add_AssemblyResolve({
  param($s,$e)
  Write-Host "[Resolve] $($e.Name)"
  return $null
}) | Out-Null

[AppDomain]::CurrentDomain.add_FirstChanceException({
  param($s,$e)
  $ex = $e.Exception
  if ($ex -is [System.IO.FileLoadException] -or $ex -is [System.IO.FileNotFoundException]) {
    Write-Host ""
    Write-Host "[FirstChance] $($ex.GetType().Name): $($ex.Message)" -ForegroundColor Yellow
    if ($ex.FusionLog) { Write-Host "FusionLog:`n$($ex.FusionLog)" -ForegroundColor DarkYellow }
  }
}) | Out-Null

try {
  $exePath = Join-Path $TeDir 'TabularEditor.exe'
  Write-Host "Loading $exePath ..."
  $asm = [System.Reflection.Assembly]::LoadFrom($exePath)
  Write-Host "Loaded: $($asm.FullName)"
  $entry = $asm.EntryPoint
  Write-Host "Invoking entry: $($entry.DeclaringType.FullName).$($entry.Name)"
  try { $entry.Invoke($null, @( ,[string[]]@() )) } catch { $entry.Invoke($null, $null) }
} catch {
  Write-Host ""
  Write-Host "[CAUGHT] $($_.Exception.GetType().FullName): $($_.Exception.Message)" -ForegroundColor Red
  $inner = $_.Exception
  $depth = 0
  while ($inner) {
    Write-Host "--- depth $depth ---"
    Write-Host "Type: $($inner.GetType().FullName)"
    Write-Host "Msg : $($inner.Message)"
    if ($inner.PSObject.Properties.Match('FusionLog').Count -gt 0 -and $inner.FusionLog) {
      Write-Host "FusionLog:`n$($inner.FusionLog)"
    }
    if ($inner.StackTrace) { Write-Host "Stack:`n$($inner.StackTrace)" }
    $inner = $inner.InnerException
    $depth++
    if ($depth -gt 10) { break }
  }
}
