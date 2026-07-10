import json, os, datetime, html

INV = r"c:\WorkFAST-main\generated-content\cosell-models\inventory.json"
OUT = r"c:\WorkFAST-main\generated-content\cosell-models\cosell-semantic-models-report.html"

with open(INV, "r", encoding="utf-8") as f:
    inv = json.load(f)

# --- Only keep analysis for these semantic models ---
KEEP_MODELS = {
    "CoMarketingModel.bim",
    "CoSellSemanticModel.bim",
    "Partner Planning and Transition Dataset.bim",
    "PartnerSharingModel.bim",
}
inv["models"] = [m for m in inv["models"] if m["bimFile"] in KEEP_MODELS]

# --- Build a clean, display-oriented data structure ---
models = []
schema_counts = {}
total_tables = 0
total_mapped = 0
total_calc = 0

for m in inv["models"]:
    tables = []
    for t in m["tables"]:
        schema = t.get("schema")
        src = t.get("sourceTable")
        slt = t.get("sourceLineageTag")
        mapped = bool(slt) and bool(schema)
        if mapped:
            total_mapped += 1
            schema_counts[schema] = schema_counts.get(schema, 0) + 1
        if t.get("isCalculated"):
            total_calc += 1
        tables.append({
            "table": t.get("table"),
            "schema": schema or "",
            "sourceTable": src or "",
            "tag": slt or "",
            "mode": t.get("partitionMode") or t.get("sourceType") or "",
            "calc": bool(t.get("isCalculated")),
        })
        total_tables += 1
    schemas_in_model = sorted({tb["schema"] for tb in tables if tb["schema"]})
    models.append({
        "file": m["bimFile"],
        "model": m["modelName"],
        "compat": m.get("compatibilityLevel"),
        "count": m["tableCount"],
        "schemas": schemas_in_model,
        "tables": tables,
    })

# Sort models by table count desc for nicer presentation
models.sort(key=lambda x: -x["count"])

meta = {
    "repo": "CoSell",
    "project": "Global Partner Solutions",
    "org": "mcapsdataengineering",
    "branch": "master",
    "folder": "/Model",
    "generated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
    "repoUrl": "https://mcapsdataengineering.visualstudio.com/Global%20Partner%20Solutions/_git/CoSell",
    "totals": {
        "models": len(models),
        "tables": total_tables,
        "mapped": total_mapped,
        "calc": total_calc,
        "schemas": len(schema_counts),
    },
    "schemaCounts": schema_counts,
}

payload = {"meta": meta, "models": models}
DATA_JSON = json.dumps(payload, ensure_ascii=False)

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CoSell Semantic Models &mdash; Source Lineage Report</title>
<style>
  :root{
    --bg:#f3f4f6; --panel:#ffffff; --ink:#1f2328; --muted:#656d76; --line:#d8dee4;
    --brand:#0a5ad6; --brand-ink:#0a3d8f; --accent:#1a7f37; --warn:#9a6700; --chip:#eef2f7;
    --shadow:0 1px 2px rgba(31,35,40,.06),0 3px 8px rgba(31,35,40,.06);
    --radius:12px; --mono:'Cascadia Code',ui-monospace,Consolas,'Courier New',monospace;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--ink);font-size:14px;line-height:1.45}
  a{color:var(--brand);text-decoration:none}
  a:hover{text-decoration:underline}

  header.top{background:linear-gradient(120deg,#0a3d8f,#0a5ad6 55%,#2b8fe6);color:#fff;padding:22px 26px 18px}
  header.top h1{margin:0;font-size:22px;font-weight:600;letter-spacing:.2px}
  header.top .sub{margin-top:6px;font-size:13px;opacity:.92}
  header.top .sub code{background:rgba(255,255,255,.16);padding:1px 7px;border-radius:6px;font-family:var(--mono);font-size:12px}

  .kpis{display:flex;gap:14px;flex-wrap:wrap;padding:18px 26px 4px}
  .kpi{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:14px 18px;min-width:140px;flex:1}
  .kpi .n{font-size:26px;font-weight:700;color:var(--brand-ink)}
  .kpi .l{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;margin-top:2px}

  .toolbar{position:sticky;top:0;z-index:20;background:rgba(243,244,246,.92);backdrop-filter:blur(6px);
    padding:14px 26px;border-bottom:1px solid var(--line);margin-top:12px}
  .toolbar .row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .search{flex:1;min-width:240px;position:relative}
  .search input{width:100%;padding:10px 12px 10px 36px;border:1px solid var(--line);border-radius:9px;font-size:14px;background:#fff}
  .search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);opacity:.5}
  .seg{display:inline-flex;border:1px solid var(--line);border-radius:9px;overflow:hidden;background:#fff}
  .seg button{border:0;background:#fff;padding:9px 14px;cursor:pointer;font-size:13px;color:var(--muted)}
  .seg button.active{background:var(--brand);color:#fff;font-weight:600}
  .btn{border:1px solid var(--line);background:#fff;border-radius:9px;padding:9px 13px;cursor:pointer;font-size:13px;color:var(--ink)}
  .btn:hover{background:#f6f8fa}
  .count{font-size:12px;color:var(--muted);margin-left:auto}

  .chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#fff;border-radius:999px;
    padding:5px 11px;font-size:12.5px;cursor:pointer;user-select:none;transition:.12s}
  .chip .dot{width:9px;height:9px;border-radius:50%}
  .chip.off{opacity:.4;filter:grayscale(.4)}
  .chip .cnt{color:var(--muted);font-size:11px}

  main{padding:18px 26px 60px}

  .card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:16px;overflow:hidden}
  .card>.head{display:flex;align-items:center;gap:14px;padding:14px 18px;cursor:pointer}
  .card>.head:hover{background:#f6f8fa}
  .card .caret{transition:transform .15s;color:var(--muted);font-size:13px}
  .card.collapsed .caret{transform:rotate(-90deg)}
  .card.collapsed .body{display:none}
  .card .title{font-size:15.5px;font-weight:600}
  .card .title .mn{font-weight:400;color:var(--muted);font-size:12.5px;margin-left:8px}
  .card .meta{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .badge{background:var(--chip);border-radius:7px;padding:3px 9px;font-size:12px;color:var(--brand-ink);font-weight:600}
  .mini-schemas{display:flex;gap:5px;flex-wrap:wrap}
  .sbadge{font-size:11px;padding:2px 8px;border-radius:6px;color:#fff;font-weight:600;white-space:nowrap}

  table.tbl{width:100%;border-collapse:collapse;font-size:13px}
  table.tbl th,table.tbl td{text-align:left;padding:8px 12px;border-top:1px solid var(--line);vertical-align:top}
  table.tbl thead th{background:#f6f8fa;color:var(--muted);font-weight:600;font-size:11.5px;text-transform:uppercase;letter-spacing:.5px;cursor:pointer;position:sticky;top:0}
  table.tbl tbody tr:hover{background:#f9fbfd}
  td.num{color:var(--muted);width:42px;font-variant-numeric:tabular-nums}
  td.tag code{font-family:var(--mono);font-size:12px;color:var(--brand-ink);background:#f0f4fb;padding:1px 6px;border-radius:5px;white-space:nowrap}
  td.src{font-family:var(--mono);font-size:12px}
  .mode{font-size:11px;color:var(--muted);text-transform:capitalize}
  .pill-calc{font-size:11px;background:#fff4e0;color:var(--warn);padding:2px 8px;border-radius:6px;border:1px solid #f5d9a8}
  mark{background:#fff3b0;padding:0 1px;border-radius:3px}

  .empty{text-align:center;color:var(--muted);padding:50px;font-size:15px}
  footer{padding:18px 26px 40px;color:var(--muted);font-size:12px;border-top:1px solid var(--line)}
  .hidden{display:none!important}
  @media print{.toolbar,.kpis{position:static}.card .head{cursor:default}.btn,.seg{display:none}}
</style>
</head>
<body>
<header class="top">
  <h1>CoSell Semantic Models &mdash; Source Lineage Report</h1>
  <div class="sub">
    Repo <a href="__REPOURL__" style="color:#fff;text-decoration:underline">__ORG__/__PROJECT__/__REPO__</a>
    &nbsp;&middot;&nbsp; branch <code>__BRANCH__</code>
    &nbsp;&middot;&nbsp; folder <code>__FOLDER__</code>
    &nbsp;&middot;&nbsp; source = table-level <code>sourceLineageTag</code> ( [Schema].[Table] )
    &nbsp;&middot;&nbsp; generated __GENERATED__
  </div>
</header>

<section class="kpis" id="kpis"></section>

<div class="toolbar">
  <div class="row">
    <div class="search">
      <svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M11.7 10.3a6 6 0 1 0-1.4 1.4l3 3a1 1 0 0 0 1.4-1.4zM3 7a4 4 0 1 1 8 0 4 4 0 0 1-8 0"/></svg>
      <input id="q" type="search" placeholder="Search models, tables, schemas, source tables&hellip;" autocomplete="off" />
    </div>
    <div class="seg" id="viewSeg">
      <button data-view="model" class="active">By Model</button>
      <button data-view="schema">By Schema</button>
    </div>
    <button class="btn" id="expandAll">Expand all</button>
    <button class="btn" id="collapseAll">Collapse all</button>
    <span class="count" id="resultCount"></span>
  </div>
  <div class="chips" id="schemaChips"></div>
</div>

<main>
  <div id="modelView"></div>
  <div id="schemaView" class="hidden"></div>
  <div id="empty" class="empty hidden">No tables match the current search / filters.</div>
</main>

<footer>
  Built from <strong>__NMODELS__</strong> <code>.bim</code> files in <code>__FOLDER__</code> on branch <code>__BRANCH__</code>.
  Schema &amp; source table are parsed verbatim from each table&rsquo;s <code>sourceLineageTag</code>.
  Tables without a <code>sourceLineageTag</code> (calculated / usage-metrics) are shown with a <span class="pill-calc">calculated</span> marker.
</footer>

<script>
const DATA = __DATA__;

// ---- schema color palette ----
const PALETTE = ['#0a5ad6','#1a7f37','#9a3fb5','#c2410c','#0891b2','#b91c47','#7c3aed','#15803d','#b45309','#0e7490','#be185d','#4338ca'];
const schemaList = Object.keys(DATA.meta.schemaCounts).sort();
const schemaColor = {};
schemaList.forEach((s,i)=> schemaColor[s] = PALETTE[i % PALETTE.length]);
const activeSchemas = new Set(schemaList);
let currentView = 'model';
let query = '';

const esc = s => (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function hl(text){
  text = esc(text);
  if(!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if(i<0) return text;
  return text.slice(0,i)+'<mark>'+text.slice(i,i+query.length)+'</mark>'+text.slice(i+query.length);
}
function sbadge(s){ if(!s) return ''; return `<span class="sbadge" style="background:${schemaColor[s]||'#888'}">${esc(s)}</span>`; }

// ---- KPIs ----
function renderKpis(){
  const t = DATA.meta.totals;
  const kpis = [
    ['Semantic Models', t.models],
    ['Total Tables', t.tables],
    ['Source-Mapped Tables', t.mapped],
    ['Distinct Schemas', t.schemas],
    ['Calculated / Unmapped', t.calc],
  ];
  document.getElementById('kpis').innerHTML = kpis.map(k=>`<div class="kpi"><div class="n">${k[1]}</div><div class="l">${k[0]}</div></div>`).join('');
}

// ---- schema chips ----
function renderChips(){
  const el = document.getElementById('schemaChips');
  el.innerHTML = schemaList.map(s=>{
    const c = DATA.meta.schemaCounts[s];
    return `<span class="chip" data-schema="${esc(s)}"><span class="dot" style="background:${schemaColor[s]}"></span>${esc(s)} <span class="cnt">${c}</span></span>`;
  }).join('');
  el.querySelectorAll('.chip').forEach(ch=>{
    ch.addEventListener('click',()=>{
      const s = ch.getAttribute('data-schema');
      if(activeSchemas.has(s)){activeSchemas.delete(s);ch.classList.add('off');}
      else{activeSchemas.add(s);ch.classList.remove('off');}
      render();
    });
  });
}

function tableMatches(tb){
  if(tb.schema && !activeSchemas.has(tb.schema)) return false;
  if(!query) return true;
  const q = query.toLowerCase();
  return (tb.table||'').toLowerCase().includes(q)
      || (tb.schema||'').toLowerCase().includes(q)
      || (tb.sourceTable||'').toLowerCase().includes(q)
      || (tb.tag||'').toLowerCase().includes(q);
}
function modelMatchesText(m){
  if(!query) return true;
  return (m.file||'').toLowerCase().includes(query.toLowerCase())
      || (m.model||'').toLowerCase().includes(query.toLowerCase());
}

// ---- By Model ----
function renderModelView(){
  const host = document.getElementById('modelView');
  let visibleTables = 0, visibleModels = 0;
  let htmlStr = '';
  DATA.models.forEach((m,mi)=>{
    const modelTextHit = modelMatchesText(m);
    const rows = m.tables.filter(tb=> tableMatches(tb) || (modelTextHit && (!tb.schema || activeSchemas.has(tb.schema))) );
    if(rows.length===0) return;
    visibleModels++; visibleTables += rows.length;
    const miniSchemas = m.schemas.filter(s=>activeSchemas.has(s)).map(sbadge).join('');
    let body = `<table class="tbl"><thead><tr>
        <th data-k="idx">#</th><th data-k="table">Table</th><th data-k="schema">Schema</th>
        <th data-k="sourceTable">Source Table</th><th data-k="tag">sourceLineageTag</th><th data-k="mode">Mode</th>
      </tr></thead><tbody>`;
    rows.forEach((tb,i)=>{
      body += `<tr>
        <td class="num">${i+1}</td>
        <td><strong>${hl(tb.table)}</strong>${tb.calc?' <span class="pill-calc">calculated</span>':''}</td>
        <td>${tb.schema?sbadge(tb.schema):'<span class="mode">&mdash;</span>'}</td>
        <td class="src">${tb.sourceTable?hl(tb.sourceTable):'<span class="mode">&mdash;</span>'}</td>
        <td class="tag">${tb.tag?('<code>'+hl(tb.tag)+'</code>'):'<span class="mode">&mdash;</span>'}</td>
        <td><span class="mode">${esc(tb.mode)||'&mdash;'}</span></td>
      </tr>`;
    });
    body += '</tbody></table>';
    htmlStr += `<div class="card" data-model="${mi}">
      <div class="head">
        <span class="caret">&#9660;</span>
        <span class="title">${hl(m.file)}<span class="mn">model: ${hl(m.model)}</span></span>
        <span class="meta">
          <span class="mini-schemas">${miniSchemas}</span>
          <span class="badge">${rows.length}${rows.length!==m.count?(' / '+m.count):''} tables</span>
        </span>
      </div>
      <div class="body">${body}</div>
    </div>`;
  });
  host.innerHTML = htmlStr;
  host.querySelectorAll('.card .head').forEach(h=> h.addEventListener('click',()=> h.parentElement.classList.toggle('collapsed')));
  return {visibleTables, visibleModels};
}

// ---- By Schema ----
function renderSchemaView(){
  const host = document.getElementById('schemaView');
  const bySchema = {};
  DATA.models.forEach(m=>{
    m.tables.forEach(tb=>{
      if(!tb.schema) return;
      if(!tableMatches(tb) && !modelMatchesText(m)) return;
      if(!activeSchemas.has(tb.schema)) return;
      (bySchema[tb.schema] = bySchema[tb.schema] || []).push({model:m.file, modelName:m.model, ...tb});
    });
  });
  let visibleTables=0, htmlStr='';
  Object.keys(bySchema).sort().forEach((s,si)=>{
    const rows = bySchema[s];
    visibleTables += rows.length;
    let body = `<table class="tbl"><thead><tr>
        <th>#</th><th>Source Table</th><th>Semantic Model</th><th>Model Table</th><th>sourceLineageTag</th>
      </tr></thead><tbody>`;
    rows.sort((a,b)=> (a.sourceTable||'').localeCompare(b.sourceTable||''));
    rows.forEach((r,i)=>{
      body += `<tr>
        <td class="num">${i+1}</td>
        <td class="src"><strong>${hl(r.sourceTable)}</strong></td>
        <td>${hl(r.model)}</td>
        <td>${hl(r.table)}</td>
        <td class="tag"><code>${hl(r.tag)}</code></td>
      </tr>`;
    });
    body += '</tbody></table>';
    htmlStr += `<div class="card" data-schema="${esc(s)}">
      <div class="head">
        <span class="caret">&#9660;</span>
        <span class="title">${sbadge(s)} <span class="mn">${rows.length} tables consumed</span></span>
        <span class="meta"><span class="badge">${rows.length}</span></span>
      </div>
      <div class="body">${body}</div>
    </div>`;
  });
  host.innerHTML = htmlStr || '';
  host.querySelectorAll('.card .head').forEach(h=> h.addEventListener('click',()=> h.parentElement.classList.toggle('collapsed')));
  return {visibleTables};
}

function render(){
  let res;
  if(currentView==='model'){
    document.getElementById('modelView').classList.remove('hidden');
    document.getElementById('schemaView').classList.add('hidden');
    res = renderModelView();
    document.getElementById('resultCount').textContent = `${res.visibleModels} models &middot; ${res.visibleTables} tables`.replace('&middot;','·');
    document.getElementById('empty').classList.toggle('hidden', res.visibleTables>0);
  } else {
    document.getElementById('modelView').classList.add('hidden');
    document.getElementById('schemaView').classList.remove('hidden');
    res = renderSchemaView();
    document.getElementById('resultCount').textContent = `${res.visibleTables} tables`;
    document.getElementById('empty').classList.toggle('hidden', res.visibleTables>0);
  }
}

// ---- wiring ----
renderKpis(); renderChips();
document.getElementById('q').addEventListener('input', e=>{ query = e.target.value.trim(); render(); });
document.querySelectorAll('#viewSeg button').forEach(b=> b.addEventListener('click',()=>{
  document.querySelectorAll('#viewSeg button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); currentView = b.getAttribute('data-view'); render();
}));
document.getElementById('expandAll').addEventListener('click',()=> document.querySelectorAll('main .card').forEach(c=>c.classList.remove('collapsed')));
document.getElementById('collapseAll').addEventListener('click',()=> document.querySelectorAll('main .card').forEach(c=>c.classList.add('collapsed')));
render();
</script>
</body>
</html>
"""

HTML = (HTML
  .replace("__DATA__", DATA_JSON)
  .replace("__REPOURL__", meta["repoUrl"])
  .replace("__ORG__", meta["org"])
  .replace("__PROJECT__", meta["project"])
  .replace("__REPO__", meta["repo"])
  .replace("__BRANCH__", meta["branch"])
  .replace("__FOLDER__", meta["folder"])
  .replace("__GENERATED__", meta["generated"])
  .replace("__NMODELS__", str(len(models)))
)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(HTML)

print("Report written:", OUT)
print("Size:", os.path.getsize(OUT), "bytes")
print("Models:", len(models), "Tables:", total_tables, "Schemas:", len(schema_counts))
