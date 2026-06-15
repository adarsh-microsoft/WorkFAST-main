/* ===== CoSell Master Analysis — app.js ===== */
(function(){
  "use strict";
  var INV = window.INVENTORY || {};
  var AN  = window.ANALYSIS || {};
  var esc = function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]);});};
  var el  = function(id){return document.getElementById(id);};

  /* ---------- top meta ---------- */
  function topMeta(){
    var t=(INV.totals)||{};
    el("m-notebooks").textContent=t.notebooks||"—";
    el("m-pipelines").textContent=t.pipelines||"—";
    el("m-models").textContent=t.models||"—";
    el("m-reports").textContent=t.reports||"—";
    var m=AN.meta||{};
    el("foot-meta").textContent="CoSell · "+(m.project||"")+" · commit "+((m.commit||"").slice(0,9))+" · analyzed "+(m.analyzedOn||"");
  }

  /* ---------- tabs ---------- */
  function initTabs(){
    var tabs=document.querySelectorAll(".tab");
    tabs.forEach(function(b){
      b.addEventListener("click",function(){
        document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("active");});
        document.querySelectorAll(".panel").forEach(function(x){x.classList.remove("active");});
        b.classList.add("active");
        var p=el(b.dataset.tab); if(p){p.classList.add("active");window.scrollTo({top:0,behavior:"smooth"});}
        if(window.__tabShown)window.__tabShown(b.dataset.tab);
      });
    });
  }

  function bars(rows,max){
    max=max||Math.max.apply(null,rows.map(function(r){return r.v;}));
    return rows.map(function(r){
      var w=max?Math.round(r.v/max*100):0;
      return '<div class="bar-row"><div class="lbl">'+esc(r.l)+'</div>'+
        '<div class="bar-track"><div class="bar-fill" style="width:'+w+'%;'+(r.c?'background:'+r.c:'')+'"></div></div>'+
        '<div class="val">'+r.v+'</div></div>';
    }).join("");
  }

  /* ---------- Overview ---------- */
  function renderOverview(){
    var m=AN.meta||{}, k=AN.kpis||[];
    var kpis=k.map(function(x){return '<div class="kpi"><div class="v">'+esc(x.value)+'</div><div class="l">'+esc(x.label)+'</div><div class="s">'+esc(x.sub)+'</div></div>';}).join("");
    var areas=(INV.areaSummary||[]).map(function(a){return {l:a.area,v:a.total};});
    var kinds=(INV.kindSummary||[]).map(function(a){return {l:a.kind,v:a.count};});
    var topAnoms=(AN.anomalies||[]).filter(function(a){return a.sev==="HIGH"||a.sev==="BLOCKER";});
    var anomCards=topAnoms.map(function(a){
      return '<div class="callout warn" style="margin-bottom:10px"><b>'+esc(a.id)+' · '+esc(a.title)+'</b> <span class="sev sev-'+a.sev+'">'+a.sev+'</span><br>'+esc(a.detail)+'</div>';
    }).join("");
    el("overview").innerHTML=
      '<div class="section-title"><h2>Executive Overview</h2><span class="hint">'+esc(m.portfolio||"")+'</span></div>'+
      '<p class="lead">'+esc(m.scopeNote||"")+'</p>'+
      '<div class="kpis" style="margin:16px 0 20px">'+kpis+'</div>'+
      '<div class="grid g2">'+
        '<div class="card"><h2>Notebooks by stream</h2>'+bars(areas)+'</div>'+
        '<div class="card"><h2>Notebooks by kind</h2>'+bars(kinds)+'</div>'+
      '</div>'+
      '<div class="card"><h2>Top blockers &amp; high-severity findings</h2>'+(anomCards||'<p class="lead">None.</p>')+
        '<p class="count-note">See the <b>Anomalies</b> tab for the full register ('+(AN.anomalies||[]).length+' findings).</p></div>'+
      '<div class="card"><h2>What this is</h2><p class="lead">A living, code-derived source of truth for the CoSell data platform: complete artifact inventory, architecture &amp; orchestration, cross-stream dependencies, PR-Review hygiene posture, an anomaly register, and a prioritized improvement backlog. Inventory &amp; architecture are confirmed by direct reads; per-notebook hygiene deepens as the waves on the Methodology tab complete.</p></div>';
  }

  /* ---------- Streams ---------- */
  function renderStreams(){
    var s=(AN.streams||[]).map(function(x){
      var ly=x.layers||{}; var lyp=Object.keys(ly).map(function(k){return '<span class="pill">'+k+' <b>'+ly[k]+'</b></span>';}).join("");
      var rep=(x.reports&&x.reports.length)?'<div class="pillrow"><span class="pill">Reports <b>'+x.reports.length+'</b></span>'+x.reports.map(function(r){return '<span class="pill">'+esc(r)+'</span>';}).join("")+'</div>':'';
      return '<div class="stream"><h3>'+esc(x.name)+'<span class="pill">'+x.notebooks+' nb · '+x.pipelines+' pipe</span></h3>'+
        '<div class="path">'+esc(x.path)+'</div>'+
        '<p>'+esc(x.purpose)+'</p>'+
        '<div class="pillrow">'+lyp+(x.lakehouse?'<span class="pill">LH <b>'+esc(x.lakehouse)+'</b></span>':'')+(x.model?'<span class="pill">Model <b>'+esc(x.model)+'</b></span>':'')+'</div>'+rep+'</div>';
    }).join("");
    el("streams").innerHTML='<div class="section-title"><h2>Functional Streams</h2><span class="hint">8 streams under /Fabric, each a medallion sub-pipeline</span></div>'+
      '<div class="grid g2">'+s+'</div>';
  }

  /* ---------- Architecture ---------- */
  function renderArch(){
    var a=AN.architecture||{};
    var layers=(a.layers||[]).map(function(l){return '<div class="node" style="border-top:3px solid '+l.color+'"><div class="t">'+esc(l.name)+'</div><div class="d">'+esc(l.role)+'</div></div>';});
    var flow='<div class="flow">'+layers.map(function(n,i){return n+(i<layers.length-1?'<div class="arrow">→</div>':'');}).join("")+'</div>';
    var orch=(a.orchestration&&a.orchestration.steps||[]).map(function(s,i){return '<div class="step"><div class="n">'+(i+1)+'</div><div class="x">'+esc(s)+'</div></div>';}).join("");
    var str=(a.orchestration&&a.orchestration.strengths||[]).map(function(s){return '<li>'+esc(s)+'</li>';}).join("");
    var gp=(AN.goodPatterns||[]).map(function(s){return '<li>'+esc(s)+'</li>';}).join("");
    el("architecture").innerHTML=
      '<div class="section-title"><h2>Architecture &amp; Orchestration</h2></div>'+
      '<div class="card"><h2>Pattern</h2><p class="lead">'+esc(a.pattern)+'</p>'+flow+'</div>'+
      '<div class="card"><h2>'+esc((a.orchestration||{}).title||"Master pipeline")+'</h2>'+orch+
        '<h3 style="margin-top:14px">Engineering strengths</h3><ul class="clean">'+str+'</ul></div>'+
      (gp?'<div class="card"><h2>✅ Confirmed good patterns <span class="tag">verified by direct read</span></h2><ul class="clean">'+gp+'</ul></div>':'')+
      '<div class="grid g2">'+
        '<div class="card"><h2>CI / AI-review automation</h2><p class="lead">'+esc((a.ci||{}).detail||"")+'</p><div class="callout info">'+esc((a.ci||{}).implication||"")+'</div></div>'+
        '<div class="card"><h2>Serving layer</h2><p class="lead">'+esc(a.serving||"")+'</p></div>'+
      '</div>';
  }

  /* ---------- Inventory ---------- */
  var nbState={q:"",area:"",layer:"",kind:"",sort:"name",dir:1};
  function renderInventory(){
    var areas=[""].concat(uniq((INV.notebooks||[]).map(function(n){return n.area;})));
    var layers=[""].concat(uniq((INV.notebooks||[]).map(function(n){return n.layer;})));
    var kinds=[""].concat(uniq((INV.notebooks||[]).map(function(n){return n.kind;})));
    function opts(arr){return arr.map(function(v){return '<option value="'+esc(v)+'">'+(v||"All")+'</option>';}).join("");}
    el("inventory").innerHTML=
      '<div class="section-title"><h2>Artifact Inventory</h2><span class="hint">'+(INV.totals.notebooks)+' notebooks · '+(INV.totals.pipelines)+' pipelines · '+(INV.totals.models)+' models · '+(INV.totals.reports)+' reports</span></div>'+
      '<div class="card"><h2>Notebooks</h2>'+
        '<div class="filters">'+
          '<input id="nb-q" placeholder="Search name or path…" />'+
          '<select id="nb-area">'+opts(areas)+'</select>'+
          '<select id="nb-layer">'+opts(layers)+'</select>'+
          '<select id="nb-kind">'+opts(kinds)+'</select>'+
          '<span class="count-note" id="nb-count"></span>'+
        '</div>'+
        '<div class="tbl-wrap"><table id="nb-tbl"><thead><tr>'+
          '<th data-s="name">Notebook</th><th data-s="area">Stream</th><th data-s="layer">Layer</th><th data-s="kind">Kind</th><th data-s="path">Path</th>'+
        '</tr></thead><tbody></tbody></table></div>'+
      '</div>'+
      '<div class="grid g2">'+
        '<div class="card"><h2>Pipelines ('+(INV.pipelines||[]).length+')</h2><div class="tbl-wrap" style="max-height:360px"><table><thead><tr><th>Pipeline</th><th>Stream</th></tr></thead><tbody>'+
          (INV.pipelines||[]).map(function(p){return '<tr><td>'+esc(p.name)+'</td><td>'+esc(p.area)+'</td></tr>';}).join("")+'</tbody></table></div></div>'+
        '<div class="card"><h2>Semantic models ('+(INV.models||[]).length+') &amp; reports ('+(INV.reports||[]).length+')</h2>'+
          '<div class="tbl-wrap" style="max-height:360px"><table><thead><tr><th>Semantic model (.bim)</th></tr></thead><tbody>'+
          (INV.models||[]).map(function(m){return '<tr><td>'+esc(m)+'</td></tr>';}).join("")+'</tbody></table></div>'+
          '<div class="tbl-wrap" style="max-height:300px;margin-top:10px"><table><thead><tr><th>Power BI report (.pbix)</th></tr></thead><tbody>'+
          (INV.reports||[]).map(function(r){return '<tr><td>'+esc(r)+'</td></tr>';}).join("")+'</tbody></table></div></div>'+
      '</div>';
    el("nb-q").addEventListener("input",function(){nbState.q=this.value.toLowerCase();drawNb();});
    el("nb-area").addEventListener("change",function(){nbState.area=this.value;drawNb();});
    el("nb-layer").addEventListener("change",function(){nbState.layer=this.value;drawNb();});
    el("nb-kind").addEventListener("change",function(){nbState.kind=this.value;drawNb();});
    document.querySelectorAll("#nb-tbl th").forEach(function(th){th.addEventListener("click",function(){var s=th.dataset.s;nbState.dir=(nbState.sort===s)?-nbState.dir:1;nbState.sort=s;drawNb();});});
    drawNb();
  }
  function drawNb(){
    var rows=(INV.notebooks||[]).filter(function(n){
      if(nbState.area&&n.area!==nbState.area)return false;
      if(nbState.layer&&n.layer!==nbState.layer)return false;
      if(nbState.kind&&n.kind!==nbState.kind)return false;
      if(nbState.q&&(n.name.toLowerCase().indexOf(nbState.q)<0&&n.path.toLowerCase().indexOf(nbState.q)<0))return false;
      return true;
    });
    rows.sort(function(x,y){var a=(x[nbState.sort]||"").toLowerCase(),b=(y[nbState.sort]||"").toLowerCase();return a<b?-nbState.dir:a>b?nbState.dir:0;});
    var body=rows.map(function(n){
      return '<tr><td>'+esc(n.name)+'</td><td>'+esc(n.area)+'</td><td><span class="badge b-'+esc(n.layer)+'">'+esc(n.layer)+'</span></td>'+
        '<td><span class="k-'+esc(n.kind)+'">'+esc(n.kind)+'</span></td><td><code style="font-size:10px">'+esc(n.path)+'</code></td></tr>';
    }).join("");
    document.querySelector("#nb-tbl tbody").innerHTML=body;
    el("nb-count").textContent=rows.length+" of "+(INV.notebooks||[]).length+" notebooks";
  }

  /* ---------- Dependencies ---------- */
  function renderDeps(){
    var d=AN.dependencies||{};
    var up=(d.upstreamSources||[]).map(function(s){return '<li>'+esc(s)+'</li>';}).join("");
    var m2r=(d.modelToReport||[]).map(function(x){return '<tr><td><b>'+esc(x.model)+'</b></td><td>'+(x.reports||[]).map(function(r){return '<span class="pill">'+esc(r)+'</span>';}).join(" ")+'</td></tr>';}).join("");
    el("dependencies").innerHTML=
      '<div class="section-title"><h2>Dependencies &amp; Lineage</h2></div>'+
      '<div class="card"><h2>End-to-end flow</h2><div class="flow">'+
        ['Upstream sources','Bronze (shortcut/import)','Silver (conform)','Gold (Dim/Fact/Map)','Gold_Publish','Semantic model (.bim)','Power BI report'].map(function(n,i,arr){return '<div class="node"><div class="t">'+n+'</div></div>'+(i<arr.length-1?'<div class="arrow">→</div>':'');}).join("")+
        '</div></div>'+
      '<div class="grid g2">'+
        '<div class="card"><h2>Upstream sources</h2><ul class="clean">'+up+'</ul></div>'+
        '<div class="card"><h2>Cross-stream coupling</h2><p class="lead">'+esc(d.crossStream||"")+'</p></div>'+
      '</div>'+
      '<div class="card"><h2>Semantic model → report lineage</h2><div class="tbl-wrap"><table><thead><tr><th>Semantic model</th><th>Reports</th></tr></thead><tbody>'+m2r+'</tbody></table></div></div>';
  }

  /* ---------- Hygiene ---------- */
  function renderHygiene(){
    var h=AN.hygiene||{};
    var sf=(h.spineFindings||[]).map(function(f){return '<tr><td>'+esc(f.item)+'</td><td><span class="verdict v-'+f.verdict+'">'+f.verdict+'</span></td><td>'+esc(f.note)+'</td></tr>';}).join("");
    var r=h.rubric||{};
    function chips(arr){return (arr||[]).map(function(x,i){return '<span class="pill"><b>'+(i+1)+'</b> '+esc(x)+'</span>';}).join(" ");}
    el("hygiene").innerHTML=
      '<div class="section-title"><h2>PR-Review Hygiene Posture</h2><span class="hint">Notebook (19) · Pipeline (10) · Model (13) checklists + 16 logic-error categories</span></div>'+
      '<div class="callout">Verdicts below are <b>confirmed from the orchestration spine reads</b>. Items marked <span class="verdict v-WAVE">WAVE</span> need the per-notebook passes on the Methodology tab before a repo-wide verdict can be issued.</div>'+
      '<div class="card" style="margin-top:14px"><h2>Spine findings (confirmed)</h2><div class="tbl-wrap"><table><thead><tr><th>Checklist / logic item</th><th>Verdict</th><th>Note</th></tr></thead><tbody>'+sf+'</tbody></table></div></div>'+
      '<div class="card"><h2>Notebook checklist (19)</h2><div class="pillrow">'+chips(r.notebook)+'</div></div>'+
      '<div class="grid g2">'+
        '<div class="card"><h2>Pipeline checklist (10)</h2><div class="pillrow">'+chips(r.pipeline)+'</div></div>'+
        '<div class="card"><h2>Model checklist (13)</h2><div class="pillrow">'+chips(r.model)+'</div></div>'+
      '</div>';
  }

  /* ---------- Anomalies ---------- */
  var anomSev="";
  function renderAnoms(){
    el("anomalies").innerHTML=
      '<div class="section-title"><h2>Anomaly Register</h2><span class="hint" id="an-count"></span></div>'+
      '<div class="filters"><select id="an-sev"><option value="">All severities</option><option>BLOCKER</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option><option>INFO</option></select>'+
      '<span class="legend"><span><span class="dot" style="background:#ef4444"></span>Blocker</span><span><span class="dot" style="background:#f97316"></span>High</span><span><span class="dot" style="background:#eab308"></span>Medium</span><span><span class="dot" style="background:#3b82f6"></span>Low</span><span><span class="dot" style="background:#64748b"></span>Info</span></span></div>'+
      '<div id="an-list"></div>';
    el("an-sev").addEventListener("change",function(){anomSev=this.value;drawAnoms();});
    drawAnoms();
  }
  function drawAnoms(){
    var list=(AN.anomalies||[]).filter(function(a){return !anomSev||a.sev===anomSev;});
    var html=list.map(function(a){
      return '<div class="card" style="padding:16px 18px">'+
        '<h2 style="justify-content:space-between"><span>'+esc(a.id)+' · '+esc(a.title)+'</span>'+
          '<span><span class="sev sev-'+a.sev+'">'+a.sev+'</span> <span class="depth">'+esc(a.depth)+'</span></span></h2>'+
        '<div class="pillrow" style="margin:2px 0 10px"><span class="pill">'+esc(a.cat)+'</span><span class="pill">Area: '+esc(a.area)+'</span></div>'+
        '<p class="lead" style="margin:0 0 8px">'+esc(a.detail)+'</p>'+
        '<div class="callout info" style="margin-bottom:8px"><b>Evidence:</b> '+esc(a.evidence)+'</div>'+
        '<div class="callout"><b>Recommendation:</b> '+esc(a.rec)+'</div></div>';
    }).join("");
    el("an-list").innerHTML=html||'<p class="lead">No findings at this severity.</p>';
    el("an-count").textContent=list.length+" of "+(AN.anomalies||[]).length+" findings";
  }

  /* ---------- Recommendations ---------- */
  function renderRecs(){
    var rows=(AN.recommendations||[]).map(function(r){
      return '<tr><td><span class="pri pri-'+r.pri+'">'+r.pri+'</span></td><td><b>'+esc(r.title)+'</b><br><span style="color:var(--txt3);font-size:12px">'+esc(r.detail)+'</span></td><td>'+esc(r.effort)+'</td><td>'+esc(r.impact)+'</td></tr>';
    }).join("");
    el("recommendations").innerHTML=
      '<div class="section-title"><h2>Improvement Backlog</h2><span class="hint">Prioritized P0 → P2</span></div>'+
      '<div class="card"><div class="tbl-wrap"><table><thead><tr><th>Pri</th><th>Recommendation</th><th>Effort</th><th>Impact</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
  }

  /* ---------- Methodology ---------- */
  function renderMethod(){
    var m=AN.methodology||{};
    var waves=(m.waves||[]).map(function(w){return '<tr><td><b>'+esc(w.id)+'</b></td><td>'+esc(w.area)+'</td><td><span class="verdict v-WAVE">'+esc(w.status)+'</span></td><td>'+esc(w.scope)+'</td></tr>';}).join("");
    el("methodology").innerHTML=
      '<div class="section-title"><h2>Methodology &amp; Wave Tracker</h2></div>'+
      '<div class="card"><h2>Approach</h2><p class="lead">'+esc(m.approach)+'</p>'+
        '<div class="callout warn" style="margin-top:10px"><b>Confidence:</b> '+esc(m.confidence)+'</div></div>'+
      '<div class="card"><h2>Per-notebook hygiene waves</h2><p class="lead">Each wave reads every notebook/.platform in its area against the full PR-Review rubric and writes results back into the Hygiene tab + the anomaly register. Run them via the WorkFast / fabric-devops subagent.</p>'+
        '<div class="tbl-wrap"><table><thead><tr><th>Wave</th><th>Area</th><th>Status</th><th>Scope</th></tr></thead><tbody>'+waves+'</tbody></table></div></div>'+
      '<div class="card"><h2>How to extend this report</h2><ul class="clean">'+
        '<li>Re-run <code>data/gen-inventory-data.ps1</code> after any repo change to refresh <code>inventory-data.js</code>.</li>'+
        '<li>Append confirmed wave findings to <code>analysis-data.js</code> (anomalies[] + hygiene.spineFindings[]) and flip the wave <code>status</code> to Done.</li>'+
        '<li>The memory MD files under <code>/memory</code> and <code>/anomalies</code> mirror this data for grep-able, diff-able review.</li>'+
      '</ul></div>';
  }

  function uniq(a){var s={},o=[];a.forEach(function(x){if(x!=null&&!s[x]){s[x]=1;o.push(x);}});return o.sort();}

  /* ---------- Notebook Analysis (59 Gold Facts) ---------- */
  var FACTS = (window.FACTS && window.FACTS.records) || [];
  var nbaState = { q:"", verdict:"", sort:"sev" };
  var SEVRANK = { BLOCKER:0, HIGH:1, WARN:2, NIT:3, PASS:4 };
  function renderNotebookAnalysis(){
    var tally = {};
    FACTS.forEach(function(f){ tally[f.verdict]=(tally[f.verdict]||0)+1; });
    var totFind = FACTS.reduce(function(s,f){return s+(f.findings?f.findings.length:0);},0);
    var totTmp = FACTS.reduce(function(s,f){return s+(f.tmp||0);},0);
    var attached = FACTS.filter(function(f){return f.att;}).length;
    var kpi = function(v,l,s){return '<div class="kpi"><div class="v">'+v+'</div><div class="l">'+l+'</div><div class="s">'+s+'</div></div>';};
    el("notebooks").innerHTML=
      '<div class="section-title"><h2>Per-Notebook Analysis — CoSell Core Gold Facts</h2><span class="hint">'+FACTS.length+' fact notebooks read file-by-file (PR-Review rubric + read/write extraction)</span></div>'+
      '<div class="callout">Each card is a real read of <code>notebook-content.py</code>. Hygiene + logic findings are per-finding. <b>Lakehouse attachment: '+(attached===0?'0 attached &#10003; (template clean)':attached+' attached &#9888;')+'</b>. The Dependency Graph tab visualizes how these facts connect upstream.</div>'+
      '<div class="kpis" style="margin:16px 0">'+
        kpi(FACTS.length,"Facts analyzed","CoSell core /Gold")+
        kpi((tally.HIGH||0)+(tally.BLOCKER||0),"High / Blocker","stubbed, broken SQL, typos")+
        kpi(totFind,"Total findings","across all facts")+
        kpi(totTmp,"tmp/vw temp views","Notebook Checklist item 15")+
      '</div>'+
      '<div class="filters">'+
        '<input id="nba-q" placeholder="Search fact name, table, finding…" />'+
        '<select id="nba-v"><option value="">All verdicts</option><option>HIGH</option><option>WARN</option><option>NIT</option><option>PASS</option></select>'+
        '<select id="nba-s"><option value="sev">Sort: severity</option><option value="name">Sort: name</option><option value="reads">Sort: # reads</option><option value="findings">Sort: # findings</option></select>'+
        '<span class="count-note" id="nba-count"></span>'+
      '</div>'+
      '<div class="nb-cards" id="nba-cards"></div>';
    el("nba-q").addEventListener("input",function(){nbaState.q=this.value.toLowerCase();drawNBA();});
    el("nba-v").addEventListener("change",function(){nbaState.verdict=this.value;drawNBA();});
    el("nba-s").addEventListener("change",function(){nbaState.sort=this.value;drawNBA();});
    drawNBA();
  }
  function drawNBA(){
    var rows=FACTS.filter(function(f){
      if(nbaState.verdict&&f.verdict!==nbaState.verdict)return false;
      if(nbaState.q){
        var hay=(f.name+' '+(f.writes||[]).join(' ')+' '+(f.reads||[]).map(function(r){return r.t;}).join(' ')+' '+(f.findings||[]).join(' ')).toLowerCase();
        if(hay.indexOf(nbaState.q)<0)return false;
      }
      return true;
    });
    rows.sort(function(a,b){
      if(nbaState.sort==="name")return a.name<b.name?-1:1;
      if(nbaState.sort==="reads")return (b.reads?b.reads.length:0)-(a.reads?a.reads.length:0);
      if(nbaState.sort==="findings")return (b.findings?b.findings.length:0)-(a.findings?a.findings.length:0);
      return (SEVRANK[a.verdict]-SEVRANK[b.verdict])||((b.reads?b.reads.length:0)-(a.reads?a.reads.length:0));
    });
    el("nba-cards").innerHTML=rows.map(function(f){
      var disp=f.name.replace(/^(?:Cosell|CoSell|PSA)_Gold_/,'');
      var byLayer={}; (f.reads||[]).forEach(function(r){byLayer[r.l]=(byLayer[r.l]||0)+1;});
      var layerChips=Object.keys(byLayer).map(function(l){return '<span class="mini">'+l+': '+byLayer[l]+'</span>';}).join('');
      var finds=(f.findings||[]).map(function(x){var p=x.split('|');var sev=p[0];var txt=p.slice(1).join('|');return '<li class="'+sev+'"><b>'+sev+'</b> — '+esc(txt)+'</li>';}).join('');
      var chips='<span class="mini '+(f.att?'bad':'ok')+'">'+(f.att?'lakehouse ATTACHED':'not attached')+'</span>'+
                '<span class="mini '+(f.se?'ok':'bad')+'">setStatus '+(f.se?'&#10003;':'&#10007;')+'</span>'+
                (f.tmp>0?'<span class="mini bad">'+f.tmp+' tmp views</span>':'<span class="mini ok">no tmp views</span>');
      return '<div class="nb-card v-'+f.verdict+'">'+
        '<h4><span>'+esc(disp)+'</span><span class="sev sev-'+f.verdict+'">'+f.verdict+'</span></h4>'+
        '<div class="io"><b>writes</b> '+esc((f.writes||[]).join(', ')||'—')+'</div>'+
        '<div class="io"><b>reads</b> '+((f.reads||[]).length)+' tables</div>'+
        '<div class="chip-row">'+layerChips+'</div>'+
        '<div class="chip-row">'+chips+'</div>'+
        (finds?'<ul class="finds">'+finds+'</ul>':'<ul class="finds"><li class="NIT">clean — template holds</li></ul>')+
      '</div>';
    }).join('');
    el("nba-count").textContent=rows.length+' of '+FACTS.length+' facts';
  }

  /* ---------- Graphs (lazy init on first show) ---------- */
  var graphInst=null, pipeInst=null;
  function buildGraphShell(panelId, title, hint, withColorToggle){
    el(panelId).innerHTML=
      '<div class="section-title"><h2>'+title+'</h2><span class="hint">'+hint+'</span></div>'+
      '<div class="graph-wrap">'+
        '<div class="graph-toolbar">'+
          '<button data-act="reheat">&#8635; Re-layout</button>'+
          '<button data-act="reset">&#10530; Reset view</button>'+
          (withColorToggle?'<select data-act="colorby"><option value="type">Color: type</option><option value="layer">Color: layer</option></select>':'')+
        '</div>'+
        '<div class="graph-hint">drag nodes · scroll to zoom · drag bg to pan · click to focus</div>'+
        '<canvas id="'+panelId+'-canvas"></canvas>'+
        '<div class="graph-tip" id="'+panelId+'-tip"></div>'+
        '<div class="graph-legend" id="'+panelId+'-legend"></div>'+
      '</div>'+
      '<div class="grid g3" style="margin-top:14px" id="'+panelId+'-stats"></div>';
  }
  function legendHTML(pairs){ return pairs.map(function(p){return '<span class="lg"><span class="sw" style="background:'+p[1]+'"></span>'+p[0]+'</span>';}).join(''); }

  function renderGraphTab(){
    if(graphInst)return;
    buildGraphShell("graph","Notebook Dependency Graph","59 Gold facts + their resolved upstream producers (Dim/Fact/Map) — edges = data flow (producer &#8594; fact)",true);
    var st=(window.GRAPHS.notebook.stats)||{};
    el("graph-stats").innerHTML=
      '<div class="card"><h2>Graph scale</h2><p class="lead">'+st.nodes+' nodes · '+st.edges+' edges. '+st.resolvedEdges+' edges resolve a fact to a producing notebook; '+st.sourceEdges+' point at Silver/Bronze source tables (no in-repo producer).</p></div>'+
      '<div class="card"><h2>Read it</h2><p class="lead">Red nodes = facts. Blue = dimension producers. Yellow = map producers. Grey = source tables. Node size = number of connections. Red ring = HIGH-severity fact. Click a node to isolate its neighborhood.</p></div>'+
      '<div class="card"><h2>Hub insight</h2><p class="lead">The two <code>_int</code> facts (FactPartnerDeal_int, FactOpportunity_int) are the most-connected hubs — they read 25–33 upstream tables and feed the FY shards + downstream facts. They concentrate change-risk.</p></div>';
    el("graph-legend").innerHTML='<b>Notebook graph</b><br>'+legendHTML([["Fact","#fca5a5"],["Dimension","#7dd3fc"],["Map","#fcd34d"],["Bridge","#a7f3d0"],["Source table","#64748b"]]);
    graphInst=new ForceGraph(el("graph-canvas"), window.GRAPHS.notebook, {tooltip:el("graph-tip"), colorBy:"type", layered:"layer", charge:-700, link:60});
    bindToolbar("graph", graphInst);
  }
  function renderPipeGraphTab(){
    if(pipeInst)return;
    buildGraphShell("pipegraph","Pipeline &amp; Stream Graphs","Orchestration DAG (confirmed from CoSell_Master_Pipeline) + cross-stream lineage",false);
    el("pipegraph-legend").innerHTML='<b>Pipeline graph</b><br>'+legendHTML([["Master","#f5c518"],["Status gate","#f97316"],["Bronze","#cd7f32"],["Silver","#9ca3af"],["Gold","#f5c518"],["Validate","#34d399"],["Publish","#10b981"],["DEAD/dup","#ef4444"]]);
    pipeInst=new ForceGraph(el("pipegraph-canvas"), window.GRAPHS.pipeline, {tooltip:el("pipegraph-tip"), colorBy:"type", layered:"pipe", charge:-1100, link:90});
    bindToolbar("pipegraph", pipeInst);
    el("pipegraph-stats").innerHTML=
      '<div class="card" style="grid-column:1/-1"><h2>Cross-stream lineage</h2><p class="lead">8 streams each run an independent config-gated master pipeline. CoSell core feeds conformed dimensions into CoMarketing, Planning and DRACR (the <code>_Planning</code> / <code>_Planning_Feed</code> variants). Dead/duplicate pipelines (red, dashed) — Gold V3/V4, TPP_Master_Refreshed, RedCarpet_Full_Refresh — are unreferenced or superseded (see anomalies A-02/A-09).</p>'+
      '<div class="flow" style="margin-top:10px">'+['Upstream','Bronze','Silver','Gold','Gold_Publish','Semantic Model','Power BI'].map(function(n,i,a){return '<div class="node"><div class="t">'+n+'</div></div>'+(i<a.length-1?'<div class="arrow">&#8594;</div>':'');}).join('')+'</div></div>';
  }
  function bindToolbar(id, inst){
    var bar=document.querySelector("#"+id+" .graph-toolbar");
    if(!bar) return;
    bar.addEventListener("click",function(ev){
      var a=ev.target.getAttribute("data-act");
      if(a==="reheat")inst.reheat();
      if(a==="reset")inst.resetView();
    });
    var sel=bar.querySelector('select[data-act="colorby"]');
    if(sel)sel.addEventListener("change",function(){inst.setColorBy(this.value);});
  }
  window.__tabShown=function(name){
    if(name==="graph")setTimeout(renderGraphTab,30);
    if(name==="pipegraph")setTimeout(renderPipeGraphTab,30);
  };

  function boot(){
    topMeta();initTabs();
    renderOverview();renderStreams();renderArch();renderInventory();renderNotebookAnalysis();renderDeps();renderHygiene();renderAnoms();renderRecs();renderMethod();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
