$base = "c:\WorkFAST-main\Cosell-Master-Analysis"
$p = Get-Content "$base\data\all-paths.txt"
$nb  = $p | Where-Object { $_ -match '\.Notebook$' }
$dp  = $p | Where-Object { $_ -match '\.DataPipeline$' }
$lh  = $p | Where-Object { $_ -match '\.Lakehouse$' }
$env = $p | Where-Object { $_ -match '\.Environment$' }
$df  = $p | Where-Object { $_ -match '\.Dataflow$' }

"=== ARTIFACT COUNTS ==="
"Notebooks    : $($nb.Count)"
"DataPipelines: $($dp.Count)"
"Lakehouses   : $($lh.Count)"
"Environments : $($env.Count)"
"Dataflows    : $($df.Count)"
""
"=== NOTEBOOKS BY TOP AREA ==="
$nb | ForEach-Object { ($_ -replace '^/Fabric/','') -replace '/.*$','' } |
    Group-Object | Sort-Object Count -Descending |
    ForEach-Object { "{0,-42} {1}" -f $_.Name, $_.Count }
""
"=== ALL PIPELINES ==="
$dp | ForEach-Object { $_ -replace '^/Fabric/','' } | Sort-Object
