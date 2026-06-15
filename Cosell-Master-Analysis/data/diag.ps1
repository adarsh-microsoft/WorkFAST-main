$base = "c:\WorkFAST-main\Cosell-Master-Analysis"
$target = Get-Content "$base\data\fact-names.txt"
$factsJs = Get-Content "$base\report\facts-data.js" -Raw
$obj = ($factsJs -replace '^window\.FACTS = ','' -replace ';\s*$','') | ConvertFrom-Json
$have = @($obj.records | ForEach-Object { $_.name })
"Target: $($target.Count)  In facts-data: $($have.Count)"
"MISSING from merge:"
$target | Where-Object { $_ -notin $have } | ForEach-Object { "  $_" }
"Verdict tally (correct):"
$obj.records | Group-Object verdict | Sort-Object Count -Descending | ForEach-Object { "  {0,-8} {1}" -f $_.Name, $_.Count }
# validate graph-data.js
$g = (Get-Content "$base\report\graph-data.js" -Raw) -replace '^window\.GRAPHS = ','' -replace ';\s*$',''
try { $gg = $g | ConvertFrom-Json; "graph-data.js valid JSON: nodes=$($gg.notebook.nodes.Count) edges=$($gg.notebook.edges.Count)" } catch { "graph-data.js INVALID: $($_.Exception.Message)" }
