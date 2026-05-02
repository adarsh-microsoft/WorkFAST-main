$searchPaths = @(
    "$env:APPDATA\Microsoft\Windows\Start Menu",
    "$env:ProgramData\Microsoft\Windows\Start Menu",
    "$env:USERPROFILE\Desktop",
    "$env:OneDrive\Desktop",
    "$env:APPDATA\Microsoft\Internet Explorer\Quick Launch\User Pinned\TaskBar"
)
$ws = New-Object -ComObject WScript.Shell
foreach ($p in $searchPaths) {
    if (Test-Path $p) {
        Get-ChildItem $p -Recurse -Filter '*.lnk' -EA 0 | ForEach-Object {
            try {
                $sc = $ws.CreateShortcut($_.FullName)
                if ($sc.TargetPath -match 'TabularEditor\.exe') {
                    "{0} -> {1}" -f $_.FullName, $sc.TargetPath
                }
            } catch {}
        }
    }
}
