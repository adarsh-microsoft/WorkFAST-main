$teDir = "C:\Program Files (x86)\Tabular Editor"
[System.Reflection.Assembly]::LoadFrom("$teDir\Microsoft.AnalysisServices.Core.dll") | Out-Null
[System.Reflection.Assembly]::LoadFrom("$teDir\Microsoft.AnalysisServices.Tabular.dll") | Out-Null
$tmdl = "c:\Users\v-adevashish\OneDrive - Microsoft\Desktop\WorkFAST-main\spec-kit\specs\002-model-geo-consolidation\model\CoMarketingModel.New.SemanticModel"
$bim  = "c:\Users\v-adevashish\OneDrive - Microsoft\Desktop\WorkFAST-main\spec-kit\specs\002-model-geo-consolidation\model\CoMarketingModel.New.bim"
try {
    $db = [Microsoft.AnalysisServices.Tabular.TmdlSerializer]::DeserializeDatabaseFromFolder($tmdl)
    $json = [Microsoft.AnalysisServices.Tabular.JsonSerializer]::SerializeDatabase($db)
    [System.IO.File]::WriteAllText($bim, $json)
    Write-Host "SUCCESS: BIM written"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}