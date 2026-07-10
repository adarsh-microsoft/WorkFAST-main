param([Parameter(Mandatory = $true)][string]$Path)
$ErrorActionPreference = 'Stop'
$full = (Resolve-Path $Path).Path
try {
    $word = New-Object -ComObject Word.Application
}
catch {
    Write-Output "WORD_COM_UNAVAILABLE: $($_.Exception.Message)"
    exit 2
}
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $word.Documents.Open($full)
foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
$doc.Fields.Update() | Out-Null
$doc.Repaginate()
$pages = $doc.ComputeStatistics(2)  # wdStatisticPages
$doc.Save()
$doc.Close()
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Output "TOC_UPDATED pages=$pages"
