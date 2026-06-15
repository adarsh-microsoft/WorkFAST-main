# Generates report/inventory-data.js from the consolidated path list.
$base = "c:\WorkFAST-main\Cosell-Master-Analysis"
$paths = Get-Content "$base\data\all-paths.txt"

function Get-Area($p) {
  $s = $p -replace '^/Fabric/',''
  if ($p -notlike '/Fabric/*') {
    if ($p -like '/Model/*')   { return 'Semantic Models' }
    if ($p -like '/Reports/*') { return 'Reports' }
    if ($p -like '/Stored Procedures/*') { return 'Stored Procedures' }
    return 'Root'
  }
  return ($s -split '/')[0]
}
function Get-Layer($p) {
  if ($p -match '/Bronze/')        { return 'Bronze' }
  if ($p -match '/Silver/')        { return 'Silver' }
  if ($p -match '/Gold_Publish/')  { return 'Gold_Publish' }
  if ($p -match '/Gold/')          { return 'Gold' }
  if ($p -match '/Init/|/init/')   { return 'Init' }
  if ($p -match '/Pipeline/|/Pipelines/|/pipeline/') { return 'Pipeline' }
  # Fall back to name-based detection for areas not foldered by layer
  $n = ($p -split '/')[-1]
  if ($n -match '(?i)_Bronze_|_Bronze\.') { return 'Bronze' }
  if ($n -match '(?i)_Silver_|_Silver\.') { return 'Silver' }
  if ($n -match '(?i)_Gold_|_Gold\.')     { return 'Gold' }
  return 'Other'
}
function Get-Kind($name) {
  switch -Regex ($name) {
    '^.*Fact'      { return 'Fact' }
    '_Map|^Map|MapOpp|MapPartner|MapSolution' { return 'Map' }
    'Bridge'       { return 'Bridge' }
    'Hist|History'  { return 'History' }
    'Dim'          { return 'Dimension' }
    'Shortcut|ShortCut|Shortcuts' { return 'Shortcut' }
    'Reset|Status|Refresh|Schema|Config|Prereq|Prerequisites|DeltaVersion' { return 'Orchestration' }
    'Snapshot'     { return 'Snapshot' }
    default        { return 'Other' }
  }
}

$nb = $paths | Where-Object { $_ -match '\.Notebook$' } | ForEach-Object {
  $name = ($_ -split '/')[-1] -replace '\.Notebook$',''
  [PSCustomObject]@{ path=$_; name=$name; area=(Get-Area $_); layer=(Get-Layer $_); kind=(Get-Kind $name) }
}
$dp = $paths | Where-Object { $_ -match '\.DataPipeline$' } | ForEach-Object {
  $name = ($_ -split '/')[-1] -replace '\.DataPipeline$',''
  [PSCustomObject]@{ path=$_; name=$name; area=(Get-Area $_) }
}
$models = $paths | Where-Object { $_ -match '\.bim$' } | ForEach-Object { ($_ -split '/')[-1] -replace '\.bim$','' }
$reports = $paths | Where-Object { $_ -match '\.pbix$' } | ForEach-Object { ($_ -split '/')[-1] -replace '\.pbix$','' }

# area summary
$areaSummary = $nb | Group-Object area | ForEach-Object {
  $g = $_.Group
  [PSCustomObject]@{
    area = $_.Name
    total = $_.Count
    bronze = ($g | Where-Object layer -eq 'Bronze').Count
    silver = ($g | Where-Object layer -eq 'Silver').Count
    gold   = ($g | Where-Object layer -eq 'Gold').Count
    goldpub= ($g | Where-Object layer -eq 'Gold_Publish').Count
    init   = ($g | Where-Object layer -eq 'Init').Count
    other  = ($g | Where-Object { $_.layer -notin @('Bronze','Silver','Gold','Gold_Publish','Init') }).Count
  }
} | Sort-Object total -Descending

$kindSummary = $nb | Group-Object kind | ForEach-Object { [PSCustomObject]@{ kind=$_.Name; count=$_.Count } } | Sort-Object count -Descending

$obj = [ordered]@{
  generatedUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
  totals = [ordered]@{ notebooks=$nb.Count; pipelines=$dp.Count; models=$models.Count; reports=$reports.Count }
  areaSummary = $areaSummary
  kindSummary = $kindSummary
  notebooks = $nb
  pipelines = $dp
  models = $models
  reports = $reports
}
$json = $obj | ConvertTo-Json -Depth 6
"window.INVENTORY = $json;" | Set-Content "$base\report\inventory-data.js" -Encoding UTF8
# also save raw json for the memory folder
$json | Set-Content "$base\data\inventory.json" -Encoding UTF8
"Wrote inventory-data.js ($([math]::Round((Get-Item "$base\report\inventory-data.js").Length/1KB,1)) KB)"
"Notebooks=$($nb.Count) Pipelines=$($dp.Count) Models=$($models.Count) Reports=$($reports.Count)"
"--- AREA SUMMARY ---"
$areaSummary | Format-Table -AutoSize | Out-String
"--- KIND SUMMARY ---"
$kindSummary | Format-Table -AutoSize | Out-String
