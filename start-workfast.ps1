<#
.SYNOPSIS
    One-click MCP launcher. Prompts for secrets ONCE, saves them, then
    generates mcp.json with real values so all listed MCP servers start.
.DESCRIPTION
    First run:  asks for Power Platform env ID. Saves to config/.mcp-secrets.
    Every run:  reads saved secrets + user-context.yaml, writes
                .vscode/mcp.json from mcp.template.json with actual values,
                lists every MCP server that will be activated, then signals
                VS Code to (re)load them.
    Context7 server is intentionally skipped.
.USAGE
    .\start-workfast.ps1          # run in VS Code integrated terminal
    .\start-workfast.ps1 -Reset   # re-prompt for all secrets
#>

param(
    [switch]$Reset
)

$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $workspace) { $workspace = $PWD.Path }

Write-Host ''
Write-Host '=== WorkFAST MCP Launcher ===' -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# Authoritative list of MCP servers managed by this launcher.
# Keep this in sync with .vscode/mcp.template.json.
# ---------------------------------------------------------------------------
$mcpServers = @(
    [pscustomobject]@{ Name = 'microsoft/azure-devops-mcp'; Type = 'stdio'; Description = 'Azure DevOps (work items, repos, pipelines, wiki, test plans, advsec)' }
    [pscustomobject]@{ Name = 'microsoft/playwright-mcp';   Type = 'stdio'; Description = 'Playwright browser automation' }
    [pscustomobject]@{ Name = 'workiq';                     Type = 'stdio'; Description = 'WorkIQ M365 productivity context' }
    [pscustomobject]@{ Name = 'mcp_MailTools';              Type = 'http';  Description = 'M365 Agent365 - Mail tools' }
    [pscustomobject]@{ Name = 'mcp_CalendarTools';          Type = 'http';  Description = 'M365 Agent365 - Calendar tools' }
    [pscustomobject]@{ Name = 'mcp_TeamsServer';            Type = 'http';  Description = 'M365 Agent365 - Teams server' }
    [pscustomobject]@{ Name = 'mcp_M365Copilot';            Type = 'http';  Description = 'M365 Agent365 - Copilot connector' }
    [pscustomobject]@{ Name = 'mcp_WordServer';             Type = 'http';  Description = 'M365 Agent365 - Word server' }
    [pscustomobject]@{ Name = 'powerbi-remote';             Type = 'http';  Description = 'Power BI / Fabric remote MCP' }
    [pscustomobject]@{ Name = 'microsoftdocs/mcp';          Type = 'http';  Description = 'Microsoft Learn docs (search/fetch/code samples)' }
    [pscustomobject]@{ Name = 'qmd';                        Type = 'stdio'; Description = 'Local QMD memory search (BM25 over markdown)' }
)

# Servers explicitly disabled (template entries that get stripped from mcp.json)
$disabledServers = @('io.github.upstash/context7')

# --- 0. Read user-context.yaml ---
$contextFile = Join-Path $workspace 'config\user-context.yaml'
if (-not (Test-Path $contextFile)) {
    Write-Error 'config\user-context.yaml not found. Run setup.ps1 first.'
    exit 1
}
$yaml = Get-Content $contextFile -Raw

function Get-YamlValue {
    param([string]$Content, [string]$Key)
    $pattern = '(?m)^\s*' + $Key + ':\s*"([^"]+)"'
    if ($Content -match $pattern) { return $Matches[1] }
    $pattern2 = '(?m)^\s*' + $Key + ':\s*(.+)$'
    if ($Content -match $pattern2) { return ($Matches[1]).Trim().Trim('"').Trim("'") }
    return $null
}

$adoOrg     = Get-YamlValue -Content $yaml -Key 'organization'
$adoDomains = 'core,work,work-items,search,test-plans,repositories,wiki,pipelines,advanced-security'
$adoTeam    = Get-YamlValue -Content $yaml -Key 'team'
Write-Host "[+] ADO org=$adoOrg  team=$adoTeam" -ForegroundColor Green

# --- 1. Load or create secrets file ---
$secretsFile = Join-Path $workspace 'config\.mcp-secrets'

if ($Reset -and (Test-Path $secretsFile)) {
    Remove-Item $secretsFile -Force
    Write-Host '[~] Cleared saved secrets (will re-prompt)' -ForegroundColor Yellow
}

if (Test-Path $secretsFile) {
    Write-Host '[+] Reading saved secrets' -ForegroundColor Green
    $secrets = @{}
    Get-Content $secretsFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $secrets[$Matches[1]] = $Matches[2]
        }
    }
    $ppEnvId = $secrets['PP_ENV_ID']
} else {
    Write-Host ''
    Write-Host 'First-time setup. You will be prompted once. Answers saved to config\.mcp-secrets' -ForegroundColor Yellow
    Write-Host ''
    $ppEnvId = Read-Host 'Power Platform Environment ID (from admin.powerplatform.microsoft.com)'

    @("PP_ENV_ID=$ppEnvId") | Set-Content $secretsFile -Encoding UTF8
    Write-Host '[+] Secrets saved. Run with -Reset to change them.' -ForegroundColor Green
}

# --- 2. Generate mcp.json from template ---
$templateFile = Join-Path $workspace '.vscode\mcp.template.json'
$mcpFile      = Join-Path $workspace '.vscode\mcp.json'

if (-not (Test-Path $templateFile)) {
    Write-Error '.vscode\mcp.template.json not found.'
    exit 1
}

$json = Get-Content $templateFile -Raw

# Replace ${input:...} placeholders with actual values
$json = $json -replace [regex]::Escape('${input:ado_org}'),        $adoOrg
$json = $json -replace [regex]::Escape('${input:ado_domain}'),     $adoDomains
$json = $json -replace [regex]::Escape('${input:ado_team1}'),      $adoTeam
$json = $json -replace [regex]::Escape('${input:environment_id}'), $ppEnvId

# Remove Context7 server block (disabled for now)
$json = $json -replace '(?s)"io\.github\.upstash/context7":\s*\{.*?\},', ''

# Remove the entire inputs array (no longer needed)
$json = $json -replace '(?s),\s*"inputs"\s*:\s*\[.*?\]', ''

$json | Set-Content $mcpFile -Encoding UTF8
Write-Host '[+] Generated .vscode\mcp.json' -ForegroundColor Green

# --- 3. List servers being activated ---
Write-Host ''
Write-Host "MCP servers being activated ($($mcpServers.Count)):" -ForegroundColor Cyan
$i = 1
foreach ($s in $mcpServers) {
    $tag = if ($s.Type -eq 'http') { '[HTTP] ' } else { '[STDIO]' }
    Write-Host ("  {0,2}. {1} {2,-32} - {3}" -f $i, $tag, $s.Name, $s.Description) -ForegroundColor Gray
    $i++
}
if ($disabledServers.Count -gt 0) {
    Write-Host ''
    Write-Host 'Skipped (intentionally disabled):' -ForegroundColor DarkYellow
    foreach ($d in $disabledServers) {
        Write-Host "   - $d" -ForegroundColor DarkGray
    }
}

# --- 4. Trigger VS Code to (re)load MCP servers ---
# Touch mcp.json so VS Code's file watcher re-picks it up, then ask the
# `code` CLI to reuse the current window on this workspace which prompts
# VS Code to activate every server declared in mcp.json.
(Get-Item $mcpFile).LastWriteTime = Get-Date

$codeCli = Get-Command code -ErrorAction SilentlyContinue
if (-not $codeCli) {
    $codeCli = Get-Command code-insiders -ErrorAction SilentlyContinue
}

if ($codeCli) {
    try {
        & $codeCli.Source --reuse-window $workspace | Out-Null
        Write-Host ''
        Write-Host '[+] Signaled VS Code to reload MCP servers' -ForegroundColor Green
    } catch {
        Write-Host ''
        Write-Host '[!] Could not auto-signal VS Code. Reload the window manually.' -ForegroundColor Yellow
    }
} else {
    Write-Host ''
    Write-Host '[!] `code` CLI not found on PATH. Reload VS Code manually to start servers.' -ForegroundColor Yellow
}

Write-Host ''
Write-Host 'Done. If a server does not start automatically:' -ForegroundColor Cyan
Write-Host '  Ctrl+Shift+P -> "MCP: List Servers" -> select -> Start' -ForegroundColor Yellow
Write-Host ''
