$f = "c:\Users\v-adevashish\AppData\Roaming\Code\User\workspaceStorage\f80fccdc8f3dba950386632b8d809d58\GitHub.copilot-chat\chat-session-resources\6fb9b9fd-2bc7-40e5-9898-dee557b4bb8f\toolu_01JR91nwZ4KgBXHRy2bwd4SY__vscode-1780989224024\content.txt"
$lines = Get-Content $f
"TOTAL LINES: $($lines.Count)"
"--- writeTable / write / save / status / version matches ---"
$pat = 'writeTable|saveAsTable|\.write|SetNotebookStatus|setNotebookStatus|addTableToVersion|VersionTable|exit\('
$lines | Select-String -Pattern $pat | ForEach-Object { "L$($_.LineNumber): $($_.Line.Trim())" }
"--- tmp_/vw_ view names ---"
$lines | Select-String -Pattern 'createOrReplaceTempView\("([^"]*)"\)' -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -match '(?i)tmp|vw' }
"--- last 25 lines ---"
$lines | Select-Object -Last 25
