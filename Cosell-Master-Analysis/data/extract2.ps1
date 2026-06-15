$sd = "c:\Users\v-adevashish\AppData\Roaming\Code\User\workspaceStorage\f80fccdc8f3dba950386632b8d809d58\GitHub.copilot-chat\chat-session-resources\6fb9b9fd-2bc7-40e5-9898-dee557b4bb8f"
foreach ($id in @('toolu_01CE7LnJ','toolu_01YYJxhu')) {
  $f = Get-ChildItem -Path $sd -Recurse -Filter "content.txt" | Where-Object { $_.FullName -like "*$id*" } | Select-Object -First 1
  if (-not $f) { "NOT FOUND: $id"; continue }
  $raw = Get-Content $f.FullName -Raw
  "=== $id ==="
  if ($raw -match 'Purpose:\s*(.+)') { "Purpose: $($Matches[1].Trim())" }
  "writeTable:"
  [regex]::Matches($raw,'writeTable\(\s*"([^"]+)"') | ForEach-Object { "  " + $_.Groups[1].Value }
  "getDataframe reads:"
  [regex]::Matches($raw,'getDataframe\([^,]+,[^,]+,\s*f?"([^"]+)"') | ForEach-Object { "  " + $_.Groups[1].Value }
  $tmp = @([regex]::Matches($raw,'createOrReplaceTempView\("([^"]+)"\)') | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -match '(?i)tmp|vw' })
  "tmp/vw views: $($tmp.Count) -> $($tmp -join ', ')"
  ""
}
