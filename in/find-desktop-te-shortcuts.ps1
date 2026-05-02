$desktops = @(
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\OneDrive - Microsoft\Desktop",
    "$env:PUBLIC\Desktop"
)
$workingTarget = "$env:USERPROFILE\Downloads\TE2-2.28-portable\TabularEditor.exe"
$sh = New-Object -ComObject WScript.Shell
$found = @()
foreach ($d in $desktops) {
    if (Test-Path $d) {
        Get-ChildItem -Path $d -Filter '*.lnk' -EA 0 | ForEach-Object {
            $lnk = $sh.CreateShortcut($_.FullName)
            if ($lnk.TargetPath -match 'TabularEditor') {
                $found += [PSCustomObject]@{
                    Path   = $_.FullName
                    Target = $lnk.TargetPath
                    IsWorking = ($lnk.TargetPath -ieq $workingTarget)
                }
            }
        }
    }
}
$found | Format-Table -AutoSize -Wrap
"---"
"Working target: $workingTarget"
