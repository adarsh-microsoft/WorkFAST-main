import re, collections, io, json

DUMP = r"c:\WorkFAST-main\generated-content\gpsmart-views-excel-dump.txt"
PROD = r"c:\WorkFAST-main\in\PROD_usp_CreateViews_CoSell_Update.txt"

# ---------- 1. Load change maps from 'Views Tracker' sheet ----------
with open(DUMP, "r", encoding="utf-8") as f:
    lines = f.read().splitlines()

sheets, cur = {}, None
for ln in lines:
    if ln.startswith("SHEET:"):
        cur = ln.split("SHEET:", 1)[1].strip(); sheets[cur] = []
    elif cur is not None and ln.startswith("[R"):
        sheets[cur].append(ln)

def parse_rows(sheet_lines):
    rows = []
    for ln in sheet_lines:
        m = re.match(r"\[R(\d+)\]\s?(.*)", ln)
        if not m: continue
        rows.append((int(m.group(1)), [c.strip() for c in m.group(2).split(" | ")]))
    return rows

rows = parse_rows(sheets["Views Tracker"])[1:]  # drop header
cosell = [c for _, c in rows if c and c[0].lower() == "cosell"]

deprecate = collections.defaultdict(set)     # view -> {col}
rename = collections.defaultdict(dict)        # view -> {old: new}
newcol = collections.defaultdict(list)        # view -> [newcolname]
for c in cosell:
    view = c[1].strip()
    col  = c[2].strip() if len(c) > 2 else ""
    ct   = c[4].strip() if len(c) > 4 else ""
    ncol = c[6].strip() if len(c) > 6 else ""
    if ct == "Deprecate":
        deprecate[view].add(col)
    elif ct == "Column Renamed":
        rename[view][col] = ncol
    elif ct == "New Column":
        newcol[view].append(ncol)

affected = sorted(set(deprecate) | set(rename) | set(newcol))

# ---------- 2. Parse PROD into view blocks ----------
text = open(PROD, "r", encoding="utf-8").read()
# Each view def starts with:  N' CREATE VIEW [CoSell].[<view>]  and ends at  '\n  );
# Find all view definition strings
view_iter = list(re.finditer(r"N'\s*CREATE VIEW \[CoSell\]\.\[(?P<v>vw_[^\]]+)\]", text))
blocks = {}
for i, m in enumerate(view_iter):
    start = m.start()
    end = view_iter[i+1].start() if i+1 < len(view_iter) else len(text)
    blocks[m.group("v")] = (start, end, text[start:end])

def output_name(expr):
    """Return output column name + a 'simple' flag for a SELECT column expression (no leading comma)."""
    e = expr.strip()
    # detect AS alias
    m = re.search(r"\bAS\b\s+(\[?[A-Za-z0-9_ ]+\]?)\s*$", e, re.IGNORECASE)
    if m:
        name = m.group(1).strip().strip("[]")
        simple = ("(" not in e.split(" AS ")[0].upper().replace("CASE", "(") if False else True)
        return name, e
    # plain reference: last dotted segment
    if "(" in e or " " in e.replace("  ", " ").strip():
        # could be complex (function/CASE/expression)
        pass
    seg = e.split(".")[-1].strip().strip("[]")
    return seg, e

report = io.StringIO()
def w(*a):
    s = " ".join(str(x) for x in a); print(s); report.write(s + "\n")

w("Affected CoSell views:", len(affected))
w("  with Deprecate:", len(deprecate), " Rename:", len(rename), " NewColumn:", len(newcol))
w("=" * 100)

missing_views = [v for v in affected if v not in blocks]
w("Affected views NOT found in PROD script:", missing_views)
w("=" * 100)

# For each affected view, get its top-level column lines (depth 0 between first SELECT and matching FROM)
def top_level_columns(defstr):
    # Work on the inside of the N'...' — strip leading N' and trailing '
    body = defstr
    # find 'SELECT' after 'AS'
    # We'll scan line by line tracking paren depth; capture lines from after top SELECT to top-level FROM
    lines = body.splitlines()
    col_lines = []   # (line_index, raw_line)
    depth = 0
    state = "pre"    # pre -> in_cols -> done(after FROM at depth0). Handle UNION by resetting.
    branches = 0
    for idx, ln in enumerate(lines):
        stripped = ln.strip()
        up = stripped.upper()
        # update depth using this line's parens but we need pre-line depth for classification
        pre_depth = depth
        # detect start of a top-level SELECT
        if state in ("pre", "after_union") and pre_depth == 0 and re.match(r"^SELECT\b", up):
            state = "in_cols"; branches += 1
            # the first column may be on same line as SELECT
            rest = stripped[len("SELECT"):].strip()
            if rest:
                col_lines.append((idx, ln, "first"))
            depth += ln.count("(") - ln.count(")")
            continue
        if state == "in_cols":
            if pre_depth == 0 and re.match(r"^FROM\b", up):
                state = "after_from"
                depth += ln.count("(") - ln.count(")")
                continue
            if pre_depth == 0:
                col_lines.append((idx, ln, "col"))
            depth += ln.count("(") - ln.count(")")
            continue
        if state == "after_from":
            if pre_depth == 0 and re.match(r"^UNION\b", up):
                state = "after_union"
            depth += ln.count("(") - ln.count(")")
            continue
        depth += ln.count("(") - ln.count(")")
    return lines, col_lines, branches

summary = {}
for v in affected:
    if v not in blocks: continue
    _, _, defstr = blocks[v]
    lines, col_lines, branches = top_level_columns(defstr)
    # Build output-name -> list of (idx, kind)
    name_map = collections.defaultdict(list)
    complex_lines = []
    for idx, ln, kind in col_lines:
        s = ln.strip()
        s2 = s[1:].strip() if s.startswith(",") else s
        # crude complexity: contains CASE / ( / no clear column
        is_complex = ("(" in s2) or re.match(r"(?i)^CASE\b", s2) or (" AS " in (" "+s2+" ") and "(" in s2)
        name, _e = output_name(s2)
        name_map[name].append((idx, kind, is_complex, s))
        if is_complex:
            complex_lines.append((name, s))
    # Check deprecate targets
    dep_status = {}
    for col in sorted(deprecate.get(v, [])):
        hits = name_map.get(col, [])
        if not hits:
            dep_status[col] = "NOT_FOUND"
        else:
            kinds = [("FIRST" if k=="first" else ("COMPLEX" if cx else "ok")) for _,k,cx,_ in hits]
            dep_status[col] = f"{len(hits)}x:{','.join(kinds)}"
    ren_status = {}
    for col, new in rename.get(v, {}).items():
        hits = name_map.get(col, [])
        ren_status[f"{col}->{new}"] = ("NOT_FOUND" if not hits else
                                       f"{len(hits)}x:" + ",".join(("FIRST" if k=='first' else ('COMPLEX' if cx else 'ok')) for _,k,cx,_ in hits))
    summary[v] = dict(branches=branches, ncols=len(col_lines),
                      deprecate=dep_status, rename=ren_status,
                      newcol=newcol.get(v, []))

# Print report
issues = []
for v in affected:
    if v not in blocks: continue
    s = summary[v]
    flags = []
    for col, st in s["deprecate"].items():
        if "NOT_FOUND" in st or "COMPLEX" in st or "FIRST" in st or (not st.startswith("1x")):
            flags.append(f"DEP {col}={st}")
    for col, st in s["rename"].items():
        if "NOT_FOUND" in st or "COMPLEX" in st or "FIRST" in st or (not st.startswith("1x")):
            flags.append(f"REN {col}={st}")
    if flags:
        issues.append((v, s["branches"], flags))

w("\nVIEWS WITH POTENTIAL EDIT ISSUES (need special handling):")
if not issues:
    w("  NONE - all deprecate/rename targets are single simple lines.")
for v, br, flags in issues:
    w(f"  {v} (branches={br}):")
    for fl in flags:
        w(f"      {fl}")

w("\nBRANCH COUNTS >1 among affected (UNION views):")
for v in affected:
    if v in summary and summary[v]["branches"] > 1:
        w(f"  {v}: branches={summary[v]['branches']}  deprecate={list(deprecate.get(v,[]))} rename={rename.get(v,{})}")

w("\nNEW COLUMN (Conversation) target views:")
for v in newcol:
    w(f"  {v}: add {newcol[v]}  (in PROD: {v in blocks})")

with open(r"c:\WorkFAST-main\generated-content\gpsmart-detection-report.txt", "w", encoding="utf-8") as fh:
    fh.write(report.getvalue())
json.dump({k:{'branches':v['branches'],'ncols':v['ncols']} for k,v in summary.items()},
          open(r"c:\WorkFAST-main\generated-content\gpsmart-view-structure.json","w"), indent=1)
w("\nSaved detection report.")
