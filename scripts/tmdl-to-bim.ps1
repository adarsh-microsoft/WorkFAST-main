$ErrorActionPreference = 'Stop'
$teDir = 'C:\Program Files\Tabular Editor 3'
Write-Host "TE dir contents (DLLs):"
Get-ChildItem $teDir -Filter '*.dll' | Select-Object Name | Format-Table -AutoSize | Out-String | Write-Host

$dlls = @(
    "$teDir\Microsoft.AnalysisServices.Core.dll",
    "$teDir\Microsoft.AnalysisServices.Tabular.dll",
    "$teDir\Microsoft.AnalysisServices.Tabular.Json.dll",
    "$teDir\Microsoft.AnalysisServices.Tabular.Tmdl.dll"
)
foreach ($d in $dlls) {
    if (Test-Path $d) {
        try {
            Add-Type -Path $d
            Write-Host "Loaded: $(Split-Path $d -Leaf)"
        } catch {
            Write-Host "Load WARN $(Split-Path $d -Leaf): $($_.Exception.Message)"
        }
    } else {
        Write-Host "NOT FOUND: $(Split-Path $d -Leaf)"
    }
}

$root = 'C:\Users\v-adevashish\OneDrive - Microsoft\Desktop\WorkFAST-main'
$tmdl = Join-Path $root 'spec-kit\specs\002-model-geo-consolidation\model\CoMarketingModel.New.SemanticModel'
$bim  = Join-Path $root 'spec-kit\specs\002-model-geo-consolidation\model\CoMarketingModel.New.bim'

Write-Host "TMDL source: $tmdl  (exists=$(Test-Path $tmdl))"
Write-Host "BIM target : $bim"

try {
    $db = [Microsoft.AnalysisServices.Tabular.TmdlSerializer]::DeserializeDatabaseFromFolder($tmdl)
    Write-Host "Deserialized: name=$($db.Name) compat=$($db.CompatibilityLevel) tables=$($db.Model.Tables.Count) rels=$($db.Model.Relationships.Count)"
    $opts = New-Object Microsoft.AnalysisServices.Tabular.SerializeOptions
    $json = [Microsoft.AnalysisServices.Tabular.JsonSerializer]::SerializeDatabase($db, $opts)
    [System.IO.File]::WriteAllText($bim, $json, [System.Text.UTF8Encoding]::new($false))
    Write-Host "WROTE BIM: $((Get-Item $bim).Length) bytes"
} catch {
    Write-Host "ERROR: $($_.Exception.GetType().FullName): $($_.Exception.Message)"
    if ($_.Exception.InnerException) { Write-Host "INNER: $($_.Exception.InnerException.Message)" }
    Write-Host $_.ScriptStackTrace
    exit 1
}
