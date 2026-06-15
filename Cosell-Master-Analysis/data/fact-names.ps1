$paths = Get-Content "c:\WorkFAST-main\Cosell-Master-Analysis\data\fact-content-paths.txt"
"Fact content paths: $($paths.Count)"
$names = $paths | ForEach-Object { ($_ -split '/')[-2] -replace '\.Notebook$','' }
$names | Set-Content "c:\WorkFAST-main\Cosell-Master-Analysis\data\fact-names.txt" -Encoding UTF8
$names | Select-Object -First 8
"..."
"Wrote fact-names.txt ($($names.Count))"
