# Merges parsed (25) + supplement (34) facts, builds producer map from inventory,
# emits report/facts-data.js (window.FACTS) and report/graph-data.js (window.GRAPHS).
$base = "c:\WorkFAST-main\Cosell-Master-Analysis"
$inv  = Get-Content "$base\data\inventory.json" -Raw | ConvertFrom-Json
$parsed = Get-Content "$base\data\facts-analysis.json" -Raw | ConvertFrom-Json
$supp  = Get-Content "$base\data\facts-supplement.json" -Raw | ConvertFrom-Json

# ---- normalize all 59 facts ----
$facts = [System.Collections.Generic.List[object]]::new()
$seen = @{}
foreach ($r in $parsed.records) {
  $reads = @()
  if ($r.reads) { $reads = @($r.reads | ForEach-Object { @{ t=$_.table; l=$_.layer } }) }
  $tmp = 0; if ($r.tmpViews) { $tmp = @($r.tmpViews).Count }
  $facts.Add([ordered]@{
    name=$r.name; writes=@($r.writes); reads=$reads; tmp=$tmp;
    ss=[bool]$r.statusStart; se=[bool]$r.statusEnd; att=[bool]$r.lakehouseAttached;
    verdict=$r.verdict; findings=@($r.findings); src="parsed"
  })
  $seen[$r.name]=$true
}
foreach ($r in $supp.records) {
  if ($seen.ContainsKey($r.name)) { continue }
  $reads = @(); if ($r.reads) { $reads = @($r.reads | ForEach-Object { @{ t=$_.t; l=$_.l } }) }
  $facts.Add([ordered]@{
    name=$r.name; writes=@($r.writes); reads=$reads; tmp=[int]$r.tmp;
    ss=[bool]$r.ss; se=[bool]$r.se; att=[bool]$r.att;
    verdict=$r.verdict; findings=@($r.findings); src="read"
  })
  $seen[$r.name]=$true
}

# ---- producer map: tableLower -> notebook (from all 515 names) ----
$producer = @{}
foreach ($nb in $inv.notebooks) {
  $tbl = ($nb.name -replace '^(?i)(cosell|tpp|mpr|comarketing)_?(gold|silver|bronze)_','')
  $key = $tbl.ToLower()
  if (-not $producer.ContainsKey($key)) { $producer[$key] = $nb.name }
}
# also map by exact notebook name suffix for fact writes
function ResolveProducer($table) {
  $k = $table.ToLower()
  if ($producer.ContainsKey($k)) { return $producer[$k] }
  # try without _int / _snapshot suffixes
  $k2 = $k -replace '_int$|_snapshot$|_inter(mediate)?$',''
  if ($producer.ContainsKey($k2)) { return $producer[$k2] }
  return $null
}

# kind classifier for nodes
function KindOf($name) {
  switch -Regex ($name) {
    'Fact' { 'Fact'; break }
    'Map'  { 'Map'; break }
    'Bridge' { 'Bridge'; break }
    'Dim'  { 'Dimension'; break }
    default { 'Other' }
  }
}

# ---- build notebook graph (facts + resolved upstream producers + source nodes) ----
$nodes = @{}
$edges = [System.Collections.Generic.List[object]]::new()
function AddNode($id,$label,$type,$layer,$kind) {
  if (-not $nodes.ContainsKey($id)) { $nodes[$id]=[ordered]@{ id=$id; label=$label; type=$type; layer=$layer; kind=$kind } }
}
foreach ($f in $facts) {
  $fid = $f.name
  AddNode $fid ($f.name -replace '^(?i)(cosell|cosell)_gold_','') 'fact' 'Gold' 'Fact'
  $nodes[$fid].verdict = $f.verdict
  $nodes[$fid].findings = @($f.findings).Count
  foreach ($rd in $f.reads) {
    $prod = ResolveProducer $rd.t
    if ($prod) {
      AddNode $prod ($prod -replace '^(?i)(cosell|cosell)_gold_','') 'producer' $rd.l (KindOf $prod)
      $edges.Add([ordered]@{ from=$prod; to=$fid; layer=$rd.l; table=$rd.t })
    } else {
      $sid = "src:$($rd.l)/$($rd.t)"
      AddNode $sid $rd.t 'source' $rd.l 'Source'
      $edges.Add([ordered]@{ from=$sid; to=$fid; layer=$rd.l; table=$rd.t })
    }
  }
}

# stats
$resolvedEdges = @($edges | Where-Object { $nodes[$_.from].type -ne 'source' }).Count
$srcEdges = @($edges | Where-Object { $nodes[$_.from].type -eq 'source' }).Count

# ---- stream graph (from streams + cross-stream) ----
$streamNodes = @(
  @{ id='upstream'; label='Upstream (D365/AMM/SharePoint/Marketplace)'; type='source' },
  @{ id='cosell'; label='CoSell Core'; type='stream'; nb=387 },
  @{ id='comarketing'; label='Co-Marketing'; type='stream'; nb=24 },
  @{ id='planning'; label='Planning'; type='stream'; nb=11 },
  @{ id='dracr'; label='DRACR Planning'; type='stream'; nb=11 },
  @{ id='tpp'; label='Joint Planning (TPP)'; type='stream'; nb=27 },
  @{ id='majors'; label='Majors (MPR)'; type='stream'; nb=20 },
  @{ id='redcarpet'; label='RedCarpet'; type='stream'; nb=27 },
  @{ id='pracflow'; label='PRACFlow'; type='stream'; nb=5 },
  @{ id='m_cosell'; label='CoSellSemanticModel'; type='model' },
  @{ id='m_comkt'; label='CoMarketingModel'; type='model' },
  @{ id='m_majors'; label='majors/MRoB Model'; type='model' },
  @{ id='m_tpp'; label='TPP_Dataset_Model'; type='model' },
  @{ id='m_psharing'; label='PartnerSharingModel'; type='model' },
  @{ id='m_planning'; label='Partner Planning & Transition'; type='model' }
)
$streamEdges = @(
  @{from='upstream';to='cosell'},@{from='upstream';to='comarketing'},@{from='upstream';to='majors'},@{from='upstream';to='tpp'},@{from='upstream';to='redcarpet'},@{from='upstream';to='pracflow'},
  @{from='cosell';to='comarketing';label='conformed dims'},@{from='cosell';to='planning';label='conformed dims'},@{from='cosell';to='dracr';label='_Planning_Feed'},@{from='cosell';to='pracflow'},
  @{from='cosell';to='m_cosell'},@{from='comarketing';to='m_comkt'},@{from='majors';to='m_majors'},@{from='tpp';to='m_tpp'},@{from='cosell';to='m_psharing'},@{from='planning';to='m_planning'},@{from='dracr';to='m_planning'}
)

# ---- pipeline graph (curated from confirmed CoSell_Master_Pipeline orchestration + stream masters) ----
$pipeNodes = @(
  @{ id='cfg'; label='GetConfiguration (config store)'; type='config' },
  @{ id='cs_master'; label='CoSell_Master_Pipeline'; type='master'; stream='CoSell' },
  @{ id='cs_status'; label='Get_Status_Flag (SP gate)'; type='gate'; stream='CoSell' },
  @{ id='cs_init'; label='Initiate_Refresh'; type='init'; stream='CoSell' },
  @{ id='cs_bronze'; label='CoSell_Bronze_Pipeline'; type='bronze'; stream='CoSell' },
  @{ id='cs_bval'; label='CoSell_Bronze_Validate'; type='validate'; stream='CoSell' },
  @{ id='cs_powerapp'; label='PowerApp (Dataverse)'; type='ext'; stream='CoSell' },
  @{ id='cs_silver'; label='CoSell_Silver_Pipeline'; type='silver'; stream='CoSell' },
  @{ id='cs_sval'; label='Notebook_Silver_Validate'; type='validate'; stream='CoSell' },
  @{ id='cs_goldv1'; label='CoSell_Gold_Pipeline (V1)'; type='gold'; stream='CoSell' },
  @{ id='cs_goldv2'; label='Gold_Pipeline_V2'; type='gold'; stream='CoSell' },
  @{ id='cs_goldval'; label='CoSell_Gold_Validation'; type='validate'; stream='CoSell' },
  @{ id='cs_publish'; label='CoSell_Publish_Schema_Pipeline'; type='publish'; stream='CoSell' },
  @{ id='cs_reset'; label='Cosell_Reset_Flag'; type='reset'; stream='CoSell' },
  @{ id='cs_goldv3'; label='Cosell_Gold_Pipeline_V3 (DEAD)'; type='dead'; stream='CoSell' },
  @{ id='cs_goldv4'; label='CoSell_Gold_Pipeline_V4 (DEAD)'; type='dead'; stream='CoSell' },
  @{ id='cs_goldv2b'; label='Gold_Pipeline_V2 alt (DEAD?)'; type='dead'; stream='CoSell' },
  @{ id='ps_master'; label='PartnerSharing_Master_Pipeline'; type='master'; stream='CoSell' },
  @{ id='ps_gold'; label='PartnerSharing_Gold_Pipeline'; type='gold'; stream='CoSell' },
  # other stream masters
  @{ id='cm_master'; label='CoMarketing_Master_Pipeline'; type='master'; stream='CoMarketing' },
  @{ id='tpp_master'; label='TPP_Master_Pipeline'; type='master'; stream='TPP' },
  @{ id='tpp_b'; label='TPP_Bronze'; type='bronze'; stream='TPP' },@{ id='tpp_s'; label='TPP_Silver'; type='silver'; stream='TPP' },@{ id='tpp_g'; label='TPP_Gold'; type='gold'; stream='TPP' },@{ id='tpp_p'; label='TPP_Publish_Pipeline'; type='publish'; stream='TPP' },
  @{ id='tpp_master2'; label='TPP_Master_Refreshed (DUP?)'; type='dead'; stream='TPP' },
  @{ id='mpr_master'; label='MPR_Master_Pipeline_V2'; type='master'; stream='Majors' },
  @{ id='mpr_b'; label='MPR_Bronze'; type='bronze'; stream='Majors' },@{ id='mpr_s'; label='MPR_Silver'; type='silver'; stream='Majors' },@{ id='mpr_g'; label='MPR_Gold'; type='gold'; stream='Majors' },@{ id='mpr_p'; label='MPR_Publish_Pipeline'; type='publish'; stream='Majors' },
  @{ id='rc_master'; label='CoSell_RedCarpet_Master_Pipeline'; type='master'; stream='RedCarpet' },
  @{ id='rc_s'; label='RedCarpet_Silver_Pipeline'; type='silver'; stream='RedCarpet' },@{ id='rc_g'; label='RedCarpet_Gold_Pipeline'; type='gold'; stream='RedCarpet' },@{ id='rc_p'; label='RedCarpet_Publish_Pipeline'; type='publish'; stream='RedCarpet' },
  @{ id='rc_master2'; label='RedCarpet_Master_Full_Refresh (DUP?)'; type='dead'; stream='RedCarpet' },
  @{ id='dracr_master'; label='DRACR_Pipeline'; type='master'; stream='DRACR' },
  @{ id='mhr_master'; label='MHR_Planning_Pipeline'; type='master'; stream='Planning' },
  @{ id='pracr_master'; label='PRACR_Master'; type='master'; stream='PRACFlow' },
  @{ id='pracr_files'; label='PRACR_ProcessPartnerFiles'; type='bronze'; stream='PRACFlow' },@{ id='pracr_snap'; label='PRACR_Snapshot'; type='gold'; stream='PRACFlow' },@{ id='pracr_email'; label='PRACR_Trigger_Email'; type='ext'; stream='PRACFlow' }
)
$pipeEdges = @(
  @{from='cfg';to='cs_master'},@{from='cs_master';to='cs_status'},@{from='cs_status';to='cs_init';label='StatusFlag 1|3'},
  @{from='cs_init';to='cs_bronze'},@{from='cs_bronze';to='cs_bval'},@{from='cs_bval';to='cs_powerapp'},@{from='cs_powerapp';to='cs_silver'},
  @{from='cs_silver';to='cs_sval'},@{from='cs_sval';to='cs_goldv1'},@{from='cs_goldv1';to='cs_goldv2'},@{from='cs_goldv2';to='cs_goldval'},@{from='cs_goldval';to='cs_publish'},
  @{from='ps_master';to='ps_gold'},
  @{from='cfg';to='cm_master'},
  @{from='cfg';to='tpp_master'},@{from='tpp_master';to='tpp_b'},@{from='tpp_b';to='tpp_s'},@{from='tpp_s';to='tpp_g'},@{from='tpp_g';to='tpp_p'},
  @{from='cfg';to='mpr_master'},@{from='mpr_master';to='mpr_b'},@{from='mpr_b';to='mpr_s'},@{from='mpr_s';to='mpr_g'},@{from='mpr_g';to='mpr_p'},
  @{from='cfg';to='rc_master'},@{from='rc_master';to='rc_s'},@{from='rc_s';to='rc_g'},@{from='rc_g';to='rc_p'},
  @{from='cfg';to='dracr_master'},@{from='cfg';to='mhr_master'},
  @{from='cfg';to='pracr_master'},@{from='pracr_master';to='pracr_files'},@{from='pracr_files';to='pracr_snap'},@{from='pracr_snap';to='pracr_email'}
)

# ---- emit ----
$factsObj = [ordered]@{ generated=(Get-Date).ToString('s'); count=$facts.Count; records=$facts }
"window.FACTS = " + ($factsObj | ConvertTo-Json -Depth 8) + ";" | Set-Content "$base\report\facts-data.js" -Encoding UTF8

$graphObj = [ordered]@{
  notebook = [ordered]@{ nodes=@($nodes.Values); edges=$edges; stats=[ordered]@{ facts=$facts.Count; nodes=$nodes.Count; edges=$edges.Count; resolvedEdges=$resolvedEdges; sourceEdges=$srcEdges } }
  stream = [ordered]@{ nodes=$streamNodes; edges=$streamEdges }
  pipeline = [ordered]@{ nodes=$pipeNodes; edges=$pipeEdges }
}
"window.GRAPHS = " + ($graphObj | ConvertTo-Json -Depth 8) + ";" | Set-Content "$base\report\graph-data.js" -Encoding UTF8

"=== BUILD COMPLETE ==="
"Facts merged: $($facts.Count) (parsed $($parsed.records.Count) + supplement)"
"Notebook graph: $($nodes.Count) nodes, $($edges.Count) edges (resolved=$resolvedEdges, source=$srcEdges)"
"Producer map entries: $($producer.Count)"
"Verdict tally:"
$facts | Group-Object verdict | Sort-Object Count -Descending | ForEach-Object { "  {0,-8} {1}" -f $_.Name,$_.Count }
"Top upstream producers (most facts fed):"
$edges | Where-Object { $nodes[$_.from].type -ne 'source' } | Group-Object from | Sort-Object Count -Descending | Select-Object -First 12 | ForEach-Object { "  {0,-45} feeds {1}" -f ($_.Name -replace '^(?i)cosell_gold_',''), $_.Count }
