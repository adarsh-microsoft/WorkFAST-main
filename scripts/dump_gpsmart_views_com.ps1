# Dump an IRM/sensitivity-label protected Excel workbook via Excel COM automation.
# Uses the signed-in user's rights to decrypt.
$ErrorActionPreference = "Stop"
$src = "c:\WorkFAST-main\in\GPSMart_views_FY27_localcopy.xlsx"
$outTxt = "c:\WorkFAST-main\generated-content\gpsmart-views-excel-dump.txt"
$outDir = "c:\WorkFAST-main\generated-content\gpsmart-views-csv"

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$sb = New-Object System.Text.StringBuilder

try {
    $wb = $excel.Workbooks.Open($src, 0, $true)  # ReadOnly
    [void]$sb.AppendLine("Workbook: $src")
    [void]$sb.AppendLine("Sheet count: $($wb.Worksheets.Count)")
    foreach ($ws in $wb.Worksheets) {
        [void]$sb.AppendLine(("=" * 100))
        [void]$sb.AppendLine("SHEET: $($ws.Name)")
        $used = $ws.UsedRange
        $rows = $used.Rows.Count
        $cols = $used.Columns.Count
        [void]$sb.AppendLine("Rows: $rows  Cols: $cols")
        [void]$sb.AppendLine(("-" * 100))

        # Read whole used range into an array in one shot (fast)
        $data = $used.Value2
        # Also export to CSV per sheet
        $csvPath = Join-Path $outDir ("{0}.csv" -f ($ws.Name -replace '[^\w\-]', '_'))
        $ws.SaveAs($csvPath, 6)  # xlCSV = 6  (saves active sheet)

        if ($null -ne $data) {
            if ($rows -eq 1 -and $cols -eq 1) {
                [void]$sb.AppendLine("[R1C1] $data")
            } else {
                for ($r = 1; $r -le $rows; $r++) {
                    $line = New-Object System.Text.StringBuilder
                    $hasContent = $false
                    for ($c = 1; $c -le $cols; $c++) {
                        $v = $data[$r, $c]
                        if ($null -ne $v -and "$v".Trim() -ne "") { $hasContent = $true }
                        [void]$line.Append("$v")
                        if ($c -lt $cols) { [void]$line.Append(" | ") }
                    }
                    if ($hasContent) { [void]$sb.AppendLine("[R$r] " + $line.ToString()) }
                }
            }
        }
    }
    $wb.Close($false)
    Write-Host "OK - dumped $($wb.Worksheets.Count) sheets"
}
catch {
    Write-Host "ERROR:" $_.Exception.Message
}
finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

[System.IO.File]::WriteAllText($outTxt, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Saved dump to $outTxt"
