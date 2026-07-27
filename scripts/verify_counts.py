import re, collections, json

DUMP = r"c:\WorkFAST-main\generated-content\gpsmart-views-excel-dump.txt"
PROD = r"c:\WorkFAST-main\in\PROD_usp_CreateViews_CoSell_Update.txt"

with open(DUMP, encoding="utf-8") as f:
    lines = f.read().splitlines()
sheets, cur = {}, None
for ln in lines:
    if ln.startswith("SHEET:"):
        cur = ln.split("SHEET:",1)[1].strip(); sheets[cur]=[]
    elif cur and ln.startswith("[R"):
        sheets[cur].append(ln)
def parse(sl):
    r=[]
    for ln in sl:
        m=re.match(r"\[R(\d+)\]\s?(.*)",ln)
        if m: r.append([c.strip() for c in m.group(2).split(" | ")])
    return r
rows=parse(sheets["Views Tracker"])[1:]
cosell=[c for c in rows if c and c[0].lower()=="cosell"]

dep=collections.defaultdict(list); ren=collections.defaultdict(dict); new=collections.defaultdict(list)
for c in cosell:
    v=c[1].strip(); col=c[2].strip() if len(c)>2 else ""; ct=c[4].strip() if len(c)>4 else ""; nc=c[6].strip() if len(c)>6 else ""
    if ct=="Deprecate": dep[v].append(col)
    elif ct=="Column Renamed": ren[v][col]=nc
    elif ct=="New Column": new[v].append(nc)

print("DEPRECATE per view (total cols = %d):" % sum(len(x) for x in dep.values()))
for v in sorted(dep, key=lambda k:-len(dep[k])):
    print(f"  {v}: {len(dep[v])} cols")
print("\nRENAME per view:")
for v in ren: print(f"  {v}: {ren[v]}")
print("\nNEWCOL per view:", dict(new))

# Now show the SolutionPlay context line for each NewColumn view to know insertion style
text=open(PROD,encoding="utf-8").read()
vi=list(re.finditer(r"N'\s*CREATE VIEW \[CoSell\]\.\[(?P<v>vw_[^\]]+)\]", text))
blocks={}
for i,m in enumerate(vi):
    s=m.start(); e=vi[i+1].start() if i+1<len(vi) else len(text)
    blocks[m.group("v")]=text[s:e]

print("\n" + "="*90)
print("SolutionPlay / DealSolutionPlay lines in each New-Column view (for insertion style):")
for v in new:
    b=blocks[v]
    hits=[ln for ln in b.splitlines() if re.search(r"(?i)\b(Deal)?SolutionPlay\b", ln)]
    print(f"\n{v}:")
    for h in hits:
        print(f"    |{h}")
