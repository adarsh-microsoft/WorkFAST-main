# Robust regex-based audit of CoSellSemanticModel.bim (TMSL, truncated at 5MB in cultures section)
param([string]$bim)
$raw = Get-Content $bim -Raw

# ---- Relationships (intact region) ----
$relStart = $raw.IndexOf('"relationships"')
$relEdges = New-Object System.Collections.Generic.List[object]
if ($relStart -ge 0) {
  # find the array bracket
  $b = $raw.IndexOf('[', $relStart)
  # brace/bracket match to find array end
  $depth = 0; $i = $b; $end = -1
  for (; $i -lt $raw.Length; $i++) {
    $c = $raw[$i]
    if ($c -eq '[') { $depth++ }
    elseif ($c -eq ']') { $depth--; if ($depth -eq 0) { $end = $i; break } }
  }
  $relText = $raw.Substring($b, $end - $b + 1)
  # split into objects by matching top-level { }
  $d = 0; $objStart = -1
  for ($i = 0; $i -lt $relText.Length; $i++) {
    $c = $relText[$i]
    if ($c -eq '{') { if ($d -eq 0) { $objStart = $i }; $d++ }
    elseif ($c -eq '}') { $d--; if ($d -eq 0) {
      $obj = $relText.Substring($objStart, $i - $objStart + 1)
      function FieldOf($o,$f){ if ($o -match ('"'+$f+'"\s*:\s*"([^"]+)"')) { $Matches[1] } else { '' } }
      $relEdges.Add([pscustomobject]@{
        fromTable = FieldOf $obj 'fromTable'
        fromColumn= FieldOf $obj 'fromColumn'
        toTable   = FieldOf $obj 'toTable'
        toColumn  = FieldOf $obj 'toColumn'
        cross     = FieldOf $obj 'crossFilteringBehavior'
        fromCard  = FieldOf $obj 'fromCardinality'
        toCard    = FieldOf $obj 'toCardinality'
        state     = FieldOf $obj 'state'
      })
    } }
  }
}
$bidi = @($relEdges | Where-Object { $_.cross -eq 'bothDirections' })
$m2m  = @($relEdges | Where-Object { $_.fromCard -eq 'many' -and $_.toCard -eq 'many' })

# ---- Tables (names) ----
$tableNames = [System.Collections.Generic.List[string]]::new()
foreach ($m in [regex]::Matches($raw, '"name"\s*:\s*"([^"]+)"\s*,\s*"lineageTag"')) { [void]$tableNames.Add($m.Groups[1].Value) }
# de-dup, these include columns too; keep heuristic table set from relationships
$relTables = @($relEdges | ForEach-Object { $_.fromTable; $_.toTable } | Sort-Object -Unique)

# ---- Measures + DAX scan ----
# Extract measure name+expression pairs
$measures = New-Object System.Collections.Generic.List[object]
foreach ($mm in [regex]::Matches($raw, '"name"\s*:\s*"([^"]+)"\s*,\s*"expression"\s*:\s*(\[(?:[^\[\]]|\[[^\]]*\])*\]|"(?:[^"\\]|\\.)*")')) {
  $nm = $mm.Groups[1].Value
  $ex = $mm.Groups[2].Value
  $measures.Add([pscustomobject]@{ name=$nm; expr=$ex })
}
function Cnt($re){ @($measures | Where-Object { $_.expr -match $re }).Count }
function Samp($re){ @($measures | Where-Object { $_.expr -match $re } | Select-Object -First 10 | ForEach-Object { $_.name }) }

$rawDiv = @($measures | Where-Object { $_.expr -match '(?<![A-Za-z0-9_)\]])\s/\s' -and $_.expr -notmatch 'DIVIDE\s*\(' })
$dax = [ordered]@{
  measuresExtracted = $measures.Count
  rawDivision  = $rawDiv.Count
  rawDivSamples= @($rawDiv | Select-Object -First 12 | ForEach-Object { $_.name })
  eqBlank      = (Cnt '=\s*BLANK\s*\(\s*\)')
  eqBlankSamp  = (Samp '=\s*BLANK\s*\(\s*\)')
  hasOneValue  = (Cnt 'HASONEVALUE\s*\(')
  hasOneSamp   = (Samp 'HASONEVALUE\s*\(')
  valuesScalar = (Cnt '(YEAR|MONTH|DAY|MAX|MIN|SUM|AVERAGE)\s*\(\s*VALUES\s*\(')
  valuesScalarSamp = (Samp '(YEAR|MONTH|DAY|MAX|MIN|SUM|AVERAGE)\s*\(\s*VALUES\s*\(')
  countNotRows = (Cnt '(?<![A-Za-z0-9_])COUNT\s*\(')
  countSamp    = (Samp '(?<![A-Za-z0-9_])COUNT\s*\(')
  filterInCalc = (Cnt 'CALCULATE\s*\([\s\S]{0,400}?FILTER\s*\(')
  filterSamp   = (Samp 'CALCULATE\s*\([\s\S]{0,400}?FILTER\s*\(')
}

$result = [ordered]@{
  parse = 'regex (bim truncated at 5MB in cultures)'
  relationships = $relEdges.Count
  bidirectional = $bidi.Count
  manyToMany = $m2m.Count
  bidiSamples = @($bidi | Select-Object -First 30 | ForEach-Object { "$($_.fromTable).$($_.fromColumn) <-> $($_.toTable).$($_.toColumn)" })
  tablesApprox = $relTables.Count
  tableNames = $relTables
  autoDateTime = if ($raw -match '__PBI_TimeIntelligenceEnabled"?\s*:\s*1') { 'ENABLED(bad)' } elseif ($raw -match '__PBI_TimeIntelligenceEnabled') { 'disabled' } else { 'unknown' }
  dateCategoryTime = ([regex]::Matches($raw,'"dataCategory"\s*:\s*"Time"')).Count
  queryCaching = if ($raw -match '"queryCachingMode"\s*:\s*"On"') { 'On' } elseif ($raw -match 'queryCachingMode') { 'set-not-On' } else { 'not-set' }
  dax = $dax
  relEdges = $relEdges
}
$out = "c:\WorkFAST-main\Cosell-Master-Analysis\data\cosell-model-audit.json"
$result | ConvertTo-Json -Depth 6 | Set-Content $out -Encoding UTF8
"Wrote $out"
"=== CoSellSemanticModel AUDIT ==="
"Relationships=$($relEdges.Count)  Bidirectional=$($bidi.Count)  ManyToMany=$($m2m.Count)  Tables~$($relTables.Count)"
"AutoDateTime=$($result.autoDateTime)  dataCategoryTime=$($result.dateCategoryTime)  QueryCaching=$($result.queryCaching)"
"Measures extracted=$($dax.measuresExtracted)"
"DAX rawDivide=$($dax.rawDivision)  eqBlank=$($dax.eqBlank)  HASONEVALUE=$($dax.hasOneValue)  VALUESscalar=$($dax.valuesScalar)  COUNT()=$($dax.countNotRows)  FILTERinCALC=$($dax.filterInCalc)"
"rawDivide samples: $($dax.rawDivSamples -join ', ')"
"bidi samples (first 12):"
$bidi | Select-Object -First 12 | ForEach-Object { "  $($_.fromTable).$($_.fromColumn) <-> $($_.toTable).$($_.toColumn)" }
