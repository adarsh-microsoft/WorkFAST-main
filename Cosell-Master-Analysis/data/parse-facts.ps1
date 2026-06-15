# Parses fetched notebook temp files for hygiene + read/write dependency edges.
# Globs the chat session-resources dir, identifies each notebook by its writeTable target,
# matches to the known fact-name list, and emits facts-analysis.json.
$sessionDir = "c:\Users\v-adevashish\AppData\Roaming\Code\User\workspaceStorage\f80fccdc8f3dba950386632b8d809d58\GitHub.copilot-chat\chat-session-resources\6fb9b9fd-2bc7-40e5-9898-dee557b4bb8f"
$base = "c:\WorkFAST-main\Cosell-Master-Analysis"
$factNames = Get-Content "$base\data\fact-names.txt"
# normalized entity -> fact name
$norm = @{}
foreach ($f in $factNames) { $norm[($f -replace '^(?i)cosell_gold_','').ToLower()] = $f }

$files = Get-ChildItem -Path $sessionDir -Recurse -Filter "content.txt" -ErrorAction SilentlyContinue
$records = @{}
$parsedFiles = 0
foreach ($file in $files) {
  $raw = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
  if (-not $raw -or $raw -notmatch 'Fabric notebook source') { continue }
  $parsedFiles++

  # writeTable targets (1st arg)
  $writes = @([regex]::Matches($raw,'writeTable\(\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
  # identity: a write whose normalized lower matches a fact (also strip a Gold_/Silver_ prefix)
  $identity = $null
  foreach ($w in $writes) {
    $wl = $w.ToLower()
    if ($norm.ContainsKey($wl)) { $identity = $norm[$wl]; break }
    $wl2 = $wl -replace '^(gold|silver|bronze)_',''
    if ($norm.ContainsKey($wl2)) { $identity = $norm[$wl2]; break }
  }
  if (-not $identity) {
    # fallback: purpose line
    if ($raw -match 'Purpose:\s*Notebook to Populate\s+([A-Za-z0-9_]+)') {
      $ent = $Matches[1].ToLower(); if ($norm.ContainsKey($ent)) { $identity = $norm[$ent] }
    }
  }
  if (-not $identity) { continue }            # not one of our facts
  if ($records.ContainsKey($identity)) { continue }  # already captured

  # reads: getDataframe(ws, lh, "schema/Table")
  $reads = New-Object System.Collections.Generic.List[object]
  foreach ($mm in [regex]::Matches($raw,'getDataframe\([^,]+,[^,]+,\s*f?"([^"]+)"')) {
    $full = $mm.Groups[1].Value
    $tbl  = ($full -split '/')[-1]
    $layer = if ($full -match '(?i)Bronze') {'Bronze'} elseif ($full -match '(?i)Silver') {'Silver'} elseif ($full -match '(?i)Gold|PublishSchema') {'Gold'} else {'Other'}
    $reads.Add([pscustomobject]@{ table=$tbl; layer=$layer })
  }
  # temp views
  $views = @([regex]::Matches($raw,'createOrReplaceTempView\("([^"]+)"\)') | ForEach-Object { $_.Groups[1].Value })
  $tmpViews = @($views | Where-Object { $_ -match '(?i)(^|_)tmp|tmp(_|$)|(^|_)vw|vw(_|$)' })

  # hygiene signals
  $lakeName = ''
  if ($raw -match 'default_lakehouse_name"\s*:\s*"([^"]*)"') { $lakeName = $Matches[1] }
  $lakeGuid = ($raw -match 'default_lakehouse"\s*:\s*"[0-9a-fA-F-]{20,}"')
  $attached = ([bool]$lakeName) -or $lakeGuid
  $statusStart = [bool]([regex]::Match($raw,'GetNotebookStatus\(')).Success
  $statusEnd   = [bool]([regex]::Match($raw,'SetNotebookStatus\(')).Success
  $sqlBlocks   = ([regex]::Matches($raw,'spark\.sql\(')).Count
  $pctSql      = [bool]([regex]::Match($raw,'(?m)^\s*#?\s*%%?sql')).Success
  $ocp         = ([regex]::Matches($raw,'OCP')).Count
  $prints      = ([regex]::Matches($raw,'(?m)^\s*print\(')).Count
  $commented   = ([regex]::Matches($raw,'(?m)^\s*--\s*,')).Count   # commented SQL column defs
  $revHist     = [bool]([regex]::Match($raw,'Revision History')).Success
  $purpose = ''
  if ($raw -match 'Purpose:\s*(.+)') { $purpose = ($Matches[1] -replace '\s+$','').Trim() }

  # findings
  $findings = New-Object System.Collections.Generic.List[string]
  $sev = 'PASS'
  if ($attached) { $findings.Add("BLOCKER|Lakehouse attached ($lakeName)"); $sev='BLOCKER' }
  if (-not $statusEnd) { $findings.Add("HIGH|Missing SetNotebookStatus at end"); if($sev -eq 'PASS'){$sev='HIGH'} }
  if (-not $statusStart) { $findings.Add("HIGH|Missing GetNotebookStatus gate"); if($sev -eq 'PASS'){$sev='HIGH'} }
  if ($tmpViews.Count -gt 0) { $findings.Add("WARN|$($tmpViews.Count) tmp/vw temp views: $($tmpViews -join ', ')"); if($sev -eq 'PASS'){$sev='WARN'} }
  if ($commented -gt 0) { $findings.Add("WARN|$commented commented-out SQL column(s)"); if($sev -eq 'PASS'){$sev='WARN'} }
  if ($pctSql) { $findings.Add("WARN|%%sql magic used (item 7)"); if($sev -eq 'PASS'){$sev='WARN'} }
  if ($ocp -gt 0) { $findings.Add("WARN|OCP occurrence x$ocp (item 16)"); if($sev -eq 'PASS'){$sev='WARN'} }
  if ($prints -gt 0) { $findings.Add("NIT|$prints print() statement(s)"); if($sev -eq 'PASS'){$sev='NIT'} }
  if (-not $revHist) { $findings.Add("NIT|No revision-history table"); if($sev -eq 'PASS'){$sev='NIT'} }

  $records[$identity] = [ordered]@{
    name = $identity
    purpose = $purpose
    writes = $writes
    readCount = $reads.Count
    reads = $reads
    tempViews = $views.Count
    tmpViews = $tmpViews
    lakehouseAttached = $attached
    statusStart = $statusStart
    statusEnd = $statusEnd
    sqlBlocks = $sqlBlocks
    pctSql = $pctSql
    ocp = $ocp
    prints = $prints
    commentedSqlCols = $commented
    revisionHistory = $revHist
    verdict = $sev
    findings = $findings
  }
}

$matched = $records.Keys.Count
$missing = @($factNames | Where-Object { -not $records.ContainsKey($_) })
$obj = [ordered]@{
  generated = (Get-Date).ToString('s')
  targetFacts = $factNames.Count
  parsedNotebookFiles = $parsedFiles
  matched = $matched
  missing = $missing
  records = @($records.Values)
}
$obj | ConvertTo-Json -Depth 8 | Set-Content "$base\data\facts-analysis.json" -Encoding UTF8
"Parsed notebook temp files: $parsedFiles"
"Matched facts: $matched / $($factNames.Count)"
if ($missing.Count) { "MISSING ($($missing.Count)): $($missing -join ', ')" }
"--- verdict tally ---"
@($records.Values) | Group-Object verdict | Sort-Object Count -Descending | ForEach-Object { "{0,-8} {1}" -f $_.Name, $_.Count }
"--- tmp-view offenders (top 12) ---"
@($records.Values) | Where-Object { $_.tmpViews.Count -gt 0 } | Sort-Object { $_.tmpViews.Count } -Descending | Select-Object -First 12 | ForEach-Object { "{0,-45} {1} tmp views" -f $_.name, $_.tmpViews.Count }
