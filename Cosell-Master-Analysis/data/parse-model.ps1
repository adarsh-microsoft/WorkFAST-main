# Parse CoSellSemanticModel.bim (TMSL/JSON) for Model Checklist + LE-15 DAX audit
param([string]$bim)
$ErrorActionPreference = 'Stop'
$raw = Get-Content $bim -Raw
$sizeMB = [math]::Round((Get-Item $bim).Length/1MB,2)
"BIM size: $sizeMB MB"

# Try JSON parse (TMSL). If it fails, fall back to regex scans.
$json = $null
try { $json = $raw | ConvertFrom-Json } catch { "JSON parse failed: $($_.Exception.Message)" }

$result = [ordered]@{}
if ($json -and $json.model) {
  $tables = $json.model.tables
  $rels   = $json.model.relationships
  $result.tables = ($tables | Measure-Object).Count
  $result.relationships = ($rels | Measure-Object).Count

  # measures
  $measures = New-Object System.Collections.Generic.List[object]
  foreach ($t in $tables) {
    if ($t.measures) {
      foreach ($m in $t.measures) {
        $expr = if ($m.expression -is [array]) { ($m.expression -join "`n") } else { [string]$m.expression }
        $measures.Add([pscustomobject]@{ table=$t.name; name=$m.name; expr=$expr })
      }
    }
  }
  $result.measures = $measures.Count

  # relationships analysis
  $bidi = @($rels | Where-Object { $_.crossFilteringBehavior -eq 'bothDirections' })
  $m2m  = @($rels | Where-Object { $_.fromCardinality -eq 'many' -and $_.toCardinality -eq 'many' })
  $result.bidirectional = $bidi.Count
  $result.manyToMany = $m2m.Count
  $result.bidiList = @($bidi | ForEach-Object { "$($_.fromTable).$($_.fromColumn) -> $($_.toTable).$($_.toColumn)" } | Select-Object -First 30)

  # date table
  $dateTables = @($tables | Where-Object { $_.dataCategory -eq 'Time' -or $_.columns.dataCategory -contains 'Time' })
  $result.dateTableMarked = $dateTables.Count
  $result.autoDateTime = if ($raw -match '__PBI_TimeIntelligenceEnabled"?\s*[:=]\s*1') { 'ENABLED(bad)' } elseif ($raw -match '__PBI_TimeIntelligenceEnabled') { 'disabled' } else { 'unknown' }

  # query caching
  $result.queryCaching = if ($raw -match '"queryCachingMode"\s*:\s*"On"') { 'On' } elseif ($raw -match 'queryCachingMode') { 'set-not-On' } else { 'not-set' }

  # DAX anti-pattern scans across all measures
  function CountMatch($list,$re){ @($list | Where-Object { $_.expr -match $re }).Count }
  $rawDivide = @($measures | Where-Object { $_.expr -match '(?<![A-Za-z0-9_])/(?![/*])' -and $_.expr -notmatch 'DIVIDE\s*\(' })
  $result.dax = [ordered]@{
    rawDivision   = $rawDivide.Count
    eqBlank       = (CountMatch $measures '=\s*BLANK\s*\(\s*\)')
    hasOneValue   = (CountMatch $measures 'HASONEVALUE\s*\(')
    valuesScalar  = (CountMatch $measures '(YEAR|MONTH|MAX|MIN|SUM)\s*\(\s*VALUES\s*\(')
    countNotRows  = (CountMatch $measures '(?<![A-Za-z0-9_])COUNT\s*\(')
    filterInCalc  = (CountMatch $measures 'CALCULATE\s*\([^)]*FILTER\s*\(')
  }
  $result.rawDivideSamples = @($rawDivide | Select-Object -First 12 | ForEach-Object { "$($_.table).$($_.name)" })

  # relationship list for graph (table-level)
  $result.relEdges = @($rels | ForEach-Object { [pscustomobject]@{ from=$_.fromTable; to=$_.toTable; bidi=($_.crossFilteringBehavior -eq 'bothDirections') } })
  $result.tableNames = @($tables | ForEach-Object { $_.name })
} else {
  # regex fallback
  $result.parse = 'regex-fallback'
  $result.measuresApprox = ([regex]::Matches($raw,'"name"\s*:\s*"[^"]+"\s*,\s*"expression"')).Count
  $result.bidirectional = ([regex]::Matches($raw,'bothDirections')).Count
  $result.queryCaching = if ($raw -match 'queryCachingMode"\s*:\s*"On"') { 'On' } else { 'not-On' }
}

$out = "c:\WorkFAST-main\Cosell-Master-Analysis\data\cosell-model-audit.json"
$result | ConvertTo-Json -Depth 6 | Set-Content $out -Encoding UTF8
"Wrote $out"
"--- SUMMARY ---"
"Tables=$($result.tables) Measures=$($result.measures) Rels=$($result.relationships) Bidi=$($result.bidirectional) M2M=$($result.manyToMany)"
"DateTableMarked=$($result.dateTableMarked) AutoDate=$($result.autoDateTime) QueryCaching=$($result.queryCaching)"
"DAX: rawDivide=$($result.dax.rawDivision) eqBlank=$($result.dax.eqBlank) hasOneValue=$($result.dax.hasOneValue) valuesScalar=$($result.dax.valuesScalar) count()=$($result.dax.countNotRows) filterInCalc=$($result.dax.filterInCalc)"
