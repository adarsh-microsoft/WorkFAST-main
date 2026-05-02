$target = 'C:\Users\Public\Desktop\Tabular Editor 3.lnk'
try {
    Remove-Item -LiteralPath $target -Force -EA Stop
    "Deleted: $target"
} catch {
    "FAILED (likely needs admin): $($_.Exception.Message)"
}
