param([string]$bim)
$raw = Get-Content $bim -Raw
$audit = Get-Content "c:\WorkFAST-main\Cosell-Master-Analysis\data\cosell-model-audit.json" -Raw | ConvertFrom-Json
# Re-extract measures the same way
$measures = New-Object System.Collections.Generic.List[object]
foreach ($mm in [regex]::Matches($raw, '"name"\s*:\s*"([^"]+)"\s*,\s*"expression"\s*:\s*(\[(?:[^\[\]]|\[[^\]]*\])*\]|"(?:[^"\\]|\\.)*")')) {
  $measures.Add([pscustomobject]@{ name=$mm.Groups[1].Value; expr=$mm.Groups[2].Value })
}
# Loose division: digit/letter/paren/bracket  /  letter/paren  (not // comment, not URLs)
$looseDiv = @($measures | Where-Object { $_.expr -match '[A-Za-z0-9_\)\]]\s*/\s*[A-Za-z0-9_\(\[]' -and $_.expr -notmatch 'DIVIDE\s*\(' })
$usesDivide = @($measures | Where-Object { $_.expr -match 'DIVIDE\s*\(' })
$keepFilters = @($measures | Where-Object { $_.expr -match 'KEEPFILTERS\s*\(' })
"Measures: $($measures.Count)"
"Uses DIVIDE(): $($usesDivide.Count)"
"Loose raw '/' division (no DIVIDE): $($looseDiv.Count)"
"  samples: $((@($looseDiv | Select-Object -First 12 | ForEach-Object { $_.name })) -join ', ')"
"Uses KEEPFILTERS(): $($keepFilters.Count)"
"FILTER-in-CALCULATE (from audit): $($audit.dax.filterInCalc)"
# persist supplement
[ordered]@{ usesDivide=$usesDivide.Count; looseRawDivision=$looseDiv.Count; looseDivSamples=@($looseDiv|Select-Object -First 15|ForEach-Object{$_.name}); usesKeepFilters=$keepFilters.Count } |
  ConvertTo-Json -Depth 5 | Set-Content "c:\WorkFAST-main\Cosell-Master-Analysis\data\cosell-model-supplement.json" -Encoding UTF8
"Wrote supplement."
