/* ===== CoSell Master Analysis — interactive force-directed graph (vanilla JS canvas) =====
   Reusable: new ForceGraph(canvas, {nodes,edges}, opts). Pan (drag bg), zoom (wheel),
   drag nodes, hover-highlight neighbors, click-focus, legend, layer/type coloring. */
(function(){
  "use strict";

  var COLORS = {
    fact:"#fca5a5", producer:"#7dd3fc", source:"#94a3b8",
    Dimension:"#7dd3fc", Fact:"#fca5a5", Map:"#fcd34d", Bridge:"#a7f3d0", Source:"#64748b", Other:"#cbd5e1",
    // pipeline
    config:"#22d3ee", master:"#f5c518", gate:"#f97316", init:"#6366f1", bronze:"#cd7f32",
    silver:"#9ca3af", gold:"#f5c518", validate:"#34d399", publish:"#10b981", reset:"#a855f7",
    ext:"#c084fc", dead:"#ef4444",
    // stream
    stream:"#60a5fa", model:"#34d399"
  };
  var LAYERCOL = { Bronze:"#cd7f32", Silver:"#9ca3af", Gold:"#f5c518", Gold_Publish:"#10b981", Other:"#64748b" };

  function ForceGraph(canvas, data, opts){
    opts = opts||{};
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.opts = opts;
    this.colorBy = opts.colorBy || "type";
    this.nodes = data.nodes.map(function(n){return Object.assign({}, n);});
    this.byId = {}; this.nodes.forEach(function(n){this.byId[n.id]=n;}, this);
    var self=this;
    this.edges = data.edges.map(function(e){return {source:self.byId[e.from], target:self.byId[e.to], raw:e};})
                          .filter(function(e){return e.source&&e.target;});
    // degree
    this.nodes.forEach(function(n){n.deg=0;});
    this.edges.forEach(function(e){e.source.deg++;e.target.deg++;});
    this.transform={x:0,y:0,k:1};
    this.hover=null; this.focus=null; this.dragNode=null; this.panning=false;
    this.alpha=1;
    this._initPositions();
    this._bind();
    this._resize();
    this._loop();
  }

  ForceGraph.prototype._initPositions=function(){
    var w=this.canvas.clientWidth||900, h=this.canvas.clientHeight||600;
    // seed: layered by layer/type on X, random Y
    var order=optsOrder(this.opts);
    this.nodes.forEach(function(n,i){
      var band = order ? (order.indexOf(n[order.key]) ) : -1;
      var bx = band>=0 ? (band+1)/(order.vals.length+1)*w : (0.2+0.6*Math.random())*w;
      n.x = bx + (Math.random()-0.5)*80;
      n.y = (0.1+0.8*Math.random())*h;
      n.vx=0; n.vy=0;
    });
    function optsOrder(o){
      if(o.layered==="layer") return {key:"layer", vals:["Bronze","Silver","Gold","Gold_Publish","Other"], indexOf:function(v){return this.vals.indexOf(v);}};
      if(o.layered==="pipe") return {key:"type", vals:["config","master","gate","init","bronze","silver","validate","gold","publish","ext","reset","dead"], indexOf:function(v){return this.vals.indexOf(v);}};
      return null;
    }
  };

  ForceGraph.prototype.color=function(n){
    if(this.colorBy==="layer") return LAYERCOL[n.layer]||"#64748b";
    return COLORS[n.type]||COLORS[n.kind]||"#cbd5e1";
  };

  ForceGraph.prototype._resize=function(){
    var dpr=window.devicePixelRatio||1;
    var r=this.canvas.getBoundingClientRect();
    this.canvas.width=r.width*dpr; this.canvas.height=r.height*dpr;
    this.ctx.setTransform(dpr,0,0,dpr,0,0);
    this.W=r.width; this.H=r.height;
  };

  ForceGraph.prototype._tick=function(){
    var n=this.nodes, e=this.edges, a=this.alpha;
    if(a<0.01){ return; }
    var k=this.opts.charge||-900;
    // repulsion O(n^2)
    for(var i=0;i<n.length;i++){
      var ni=n[i];
      for(var j=i+1;j<n.length;j++){
        var nj=n[j];
        var dx=ni.x-nj.x, dy=ni.y-nj.y;
        var d2=dx*dx+dy*dy+0.01; var d=Math.sqrt(d2);
        var f=k/d2; var fx=f*dx/d, fy=f*dy/d;
        ni.vx+=fx*a; ni.vy+=fy*a; nj.vx-=fx*a; nj.vy-=fy*a;
      }
    }
    // springs
    var L=this.opts.link||70;
    for(var m=0;m<e.length;m++){
      var s=e[m].source, t=e[m].target;
      var dx=t.x-s.x, dy=t.y-s.y; var d=Math.sqrt(dx*dx+dy*dy)+0.01;
      var f=(d-L)*0.02*a; var fx=f*dx/d, fy=f*dy/d;
      s.vx+=fx; s.vy+=fy; t.vx-=fx; t.vy-=fy;
    }
    // centering + integrate
    var cx=this.W/2, cy=this.H/2;
    for(var p=0;p<n.length;p++){
      var nd=n[p];
      nd.vx+=(cx-nd.x)*0.0008*a; nd.vy+=(cy-nd.y)*0.0008*a;
      if(nd===this.dragNode){ nd.vx=0; nd.vy=0; continue; }
      nd.vx*=0.86; nd.vy*=0.86;
      nd.x+=Math.max(-15,Math.min(15,nd.vx)); nd.y+=Math.max(-15,Math.min(15,nd.vy));
    }
    this.alpha*=0.985;
  };

  ForceGraph.prototype._draw=function(){
    var c=this.ctx, t=this.transform;
    c.save(); c.clearRect(0,0,this.W,this.H);
    c.translate(t.x,t.y); c.scale(t.k,t.k);
    var hl=this.focus||this.hover;
    var nb={};
    if(hl){ nb[hl.id]=1; this.edges.forEach(function(e){ if(e.source===hl)nb[e.target.id]=1; if(e.target===hl)nb[e.source.id]=1;});}
    // edges
    for(var i=0;i<this.edges.length;i++){
      var e=this.edges[i], on=!hl||(e.source===hl||e.target===hl);
      c.beginPath(); c.moveTo(e.source.x,e.source.y); c.lineTo(e.target.x,e.target.y);
      c.strokeStyle= on? (LAYERCOL[e.raw.layer]||"rgba(148,163,184,.5)") : "rgba(80,95,120,.08)";
      c.lineWidth=(on?1.1:0.5)/t.k; c.globalAlpha=on?0.55:0.12; c.stroke();
      if(on && hl && t.k>0.6){ // arrowhead
        var dx=e.target.x-e.source.x, dy=e.target.y-e.source.y, d=Math.sqrt(dx*dx+dy*dy)||1;
        var r=(e.target.r||6)+2; var ax=e.target.x-dx/d*r, ay=e.target.y-dy/d*r;
        c.globalAlpha=0.6; c.fillStyle="rgba(180,195,220,.7)";
        c.beginPath(); c.moveTo(ax,ay);
        c.lineTo(ax-(dx/d*7+dy/d*4)/t.k, ay-(dy/d*7-dx/d*4)/t.k);
        c.lineTo(ax-(dx/d*7-dy/d*4)/t.k, ay-(dy/d*7+dx/d*4)/t.k); c.closePath(); c.fill();
      }
    }
    c.globalAlpha=1;
    // nodes
    for(var k=0;k<this.nodes.length;k++){
      var n=this.nodes[k]; var on=!hl||nb[n.id];
      var r=4+Math.min(11,Math.sqrt(n.deg||1)*1.7); n.r=r;
      c.beginPath(); c.arc(n.x,n.y,r,0,6.283);
      c.fillStyle=this.color(n); c.globalAlpha=on?1:0.18; c.fill();
      if(n.verdict==="HIGH"||n.verdict==="BLOCKER"){ c.lineWidth=2/t.k; c.strokeStyle=on?"#ef4444":"rgba(239,68,68,.2)"; c.stroke(); }
      else if(n.type==="dead"){ c.lineWidth=2/t.k; c.strokeStyle="#ef4444"; c.setLineDash([3/t.k,2/t.k]); c.stroke(); c.setLineDash([]); }
      if((hl&&nb[n.id]&&t.k>0.5)|| t.k>1.5 || (n.deg>=8&&t.k>0.7)){
        c.globalAlpha=on?1:0.3; c.fillStyle="#dbe4f0"; c.font=(11/t.k)+"px Segoe UI";
        c.fillText(n.label, n.x+r+2/t.k, n.y+3/t.k);
      }
    }
    c.globalAlpha=1; c.restore();
  };

  ForceGraph.prototype._loop=function(){ var self=this; function f(){ self._tick(); self._draw(); requestAnimationFrame(f);} f(); };

  ForceGraph.prototype._screenToWorld=function(sx,sy){ var t=this.transform; return {x:(sx-t.x)/t.k, y:(sy-t.y)/t.k}; };
  ForceGraph.prototype._nodeAt=function(sx,sy){
    var w=this._screenToWorld(sx,sy), best=null, bd=1e9;
    for(var i=0;i<this.nodes.length;i++){ var n=this.nodes[i]; var dx=n.x-w.x, dy=n.y-w.y; var d=dx*dx+dy*dy; var r=(n.r||6)+4; if(d<r*r&&d<bd){bd=d;best=n;} }
    return best;
  };

  ForceGraph.prototype._bind=function(){
    var self=this, cv=this.canvas, sx=0, sy=0, last=null;
    window.addEventListener("resize", function(){ self._resize(); });
    cv.addEventListener("mousedown", function(ev){
      var r=cv.getBoundingClientRect(); var x=ev.clientX-r.left, y=ev.clientY-r.top;
      var n=self._nodeAt(x,y);
      if(n){ self.dragNode=n; self.alpha=Math.max(self.alpha,0.5);} else { self.panning=true; last={x:ev.clientX,y:ev.clientY}; }
    });
    window.addEventListener("mousemove", function(ev){
      var r=cv.getBoundingClientRect(); var x=ev.clientX-r.left, y=ev.clientY-r.top;
      if(self.dragNode){ var w=self._screenToWorld(x,y); self.dragNode.x=w.x; self.dragNode.y=w.y; self.alpha=Math.max(self.alpha,0.3); }
      else if(self.panning&&last){ self.transform.x+=ev.clientX-last.x; self.transform.y+=ev.clientY-last.y; last={x:ev.clientX,y:ev.clientY}; }
      else { var n=self._nodeAt(x,y); if(n!==self.hover){ self.hover=n; self._tip(n,x,y);} else if(n){ self._tip(n,x,y);} }
    });
    window.addEventListener("mouseup", function(){ self.dragNode=null; self.panning=false; last=null; });
    cv.addEventListener("click", function(ev){
      var r=cv.getBoundingClientRect(); var n=self._nodeAt(ev.clientX-r.left, ev.clientY-r.top);
      self.focus=(self.focus===n)?null:n;
    });
    cv.addEventListener("wheel", function(ev){
      ev.preventDefault();
      var r=cv.getBoundingClientRect(); var mx=ev.clientX-r.left, my=ev.clientY-r.top;
      var s=ev.deltaY<0?1.12:0.89; var t=self.transform;
      var wx=(mx-t.x)/t.k, wy=(my-t.y)/t.k;
      t.k=Math.max(0.15,Math.min(5,t.k*s)); t.x=mx-wx*t.k; t.y=my-wy*t.k;
    }, {passive:false});
  };

  ForceGraph.prototype._tip=function(n,x,y){
    var tip=this.opts.tooltip; if(!tip) return;
    if(!n){ tip.style.display="none"; return; }
    var html='<b>'+esc(n.label)+'</b>';
    if(n.type) html+='<br><span class="t-dim">type:</span> '+esc(n.type);
    if(n.layer) html+=' <span class="t-dim">layer:</span> '+esc(n.layer);
    if(n.kind&&n.kind!==n.type) html+=' <span class="t-dim">kind:</span> '+esc(n.kind);
    html+='<br><span class="t-dim">connections:</span> '+(n.deg||0);
    if(n.verdict) html+='<br><span class="t-dim">verdict:</span> '+esc(n.verdict);
    if(n.findings) html+=' ('+n.findings+' findings)';
    tip.innerHTML=html; tip.style.display="block";
    tip.style.left=(x+16)+"px"; tip.style.top=(y+12)+"px";
  };
  ForceGraph.prototype.reheat=function(){ this.alpha=1; };
  ForceGraph.prototype.setColorBy=function(m){ this.colorBy=m; };
  ForceGraph.prototype.resetView=function(){ this.transform={x:0,y:0,k:1}; this.focus=null; };

  function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]);});}
  window.ForceGraph=ForceGraph;
})();
