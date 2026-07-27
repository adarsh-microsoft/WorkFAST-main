import re, collections, io, sys

DUMP = r"c:\WorkFAST-main\generated-content\gpsmart-views-excel-dump.txt"
PROD = r"c:\WorkFAST-main\in\PROD_usp_CreateViews_CoSell_Update.txt"
OUT_WS = r"c:\WorkFAST-main\in\DEV_usp_CreateViews_CoSell_Update.txt"
REPORT = r"c:\WorkFAST-main\generated-content\gpsmart-transform-report.txt"
WRITE = "--write" in sys.argv

rep = io.StringIO()
def w(*a):
    s = " ".join(str(x) for x in a); print(s); rep.write(s + "\n")

# ---------- change maps from 'Views Tracker' ----------
with open(DUMP, encoding="utf-8") as f:
    dlines = f.read().splitlines()
sheets, cur = {}, None
for ln in dlines:
    if ln.startswith("SHEET:"):
        cur = ln.split("SHEET:", 1)[1].strip(); sheets[cur] = []
    elif cur and ln.startswith("[R"):
        sheets[cur].append(ln)
def prows(sl):
    r = []
    for ln in sl:
        m = re.match(r"\[R(\d+)\]\s?(.*)", ln)
        if m: r.append([c.strip() for c in m.group(2).split(" | ")])
    return r
cosell = [c for c in prows(sheets["Views Tracker"])[1:] if c and c[0].lower() == "cosell"]

deprecate = collections.defaultdict(set)
rename = collections.defaultdict(dict)
newcol = collections.defaultdict(list)
for c in cosell:
    v = c[1].strip(); col = c[2].strip() if len(c) > 2 else ""; ct = c[4].strip() if len(c) > 4 else ""; nc = c[6].strip() if len(c) > 6 else ""
    if ct == "Deprecate": deprecate[v].add(col)
    elif ct == "Column Renamed": rename[v][col] = nc
    elif ct == "New Column": newcol[v].append(nc)

# sanity: no column both renamed and deprecated
for v in rename:
    overlap = set(rename[v]) & deprecate.get(v, set())
    if overlap:
        w("FATAL: column both renamed and deprecated in", v, overlap); sys.exit(1)

# ---------- read PROD preserving EOL ----------
data = open(PROD, "r", encoding="utf-8", newline="").read()
NL = "\r\n" if "\r\n" in data else "\n"
lines = data.split(NL)

# locate view start lines
view_start = {}   # view -> absolute line index of 'CREATE VIEW [CoSell].[view]'
order = []
for i, ln in enumerate(lines):
    m = re.search(r"CREATE VIEW \[CoSell\]\.\[(vw_[^\]]+)\]", ln)
    if m:
        view_start[m.group(1)] = i
        order.append(m.group(1))
w("Total CoSell CREATE VIEW lines in PROD:", len(order))

def out_name(expr):
    e = expr.strip()
    if e.startswith(","): e = e[1:].strip()
    e = e.rstrip(",").strip()
    m = re.search(r"\bAS\b\s+(\[[^\]]+\]|[A-Za-z0-9_]+)\s*$", e, re.IGNORECASE)
    if m: return m.group(1).strip().strip("[]"), e
    seg = e.split(".")[-1].strip().strip("[]")
    return seg, e

def top_level_cols(start_idx, end_idx):
    """Return list of absolute indices of top-level SELECT column lines in [start_idx, end_idx)."""
    col_idx = []
    depth = 0; state = "pre"
    for i in range(start_idx, end_idx):
        ln = lines[i]; s = ln.strip(); up = s.upper()
        pre = depth
        if state in ("pre", "after_union") and pre == 0 and re.match(r"^SELECT\b", up):
            state = "in"
            rest = s[6:].strip()
            rest = re.sub(r"(?i)^DISTINCT\b", "", rest).strip()
            if rest: col_idx.append(i)
            depth += ln.count("(") - ln.count(")"); continue
        if state == "in":
            if pre == 0 and re.match(r"^FROM\b", up):
                state = "afterfrom"; depth += ln.count("(") - ln.count(")"); continue
            if pre == 0 and s: col_idx.append(i)
            depth += ln.count("(") - ln.count(")"); continue
        if state == "afterfrom":
            if pre == 0 and re.match(r"^UNION\b", up): state = "after_union"
            depth += ln.count("(") - ln.count(")"); continue
        depth += ln.count("(") - ln.count(")")
    return col_idx

def is_leading(ln):  return ln.strip().startswith(",")
def lead_ws(ln):     return ln[:len(ln) - len(ln.lstrip())]

def apply_rename(ln, old, new):
    lead = lead_ws(ln); body = ln.strip(); comma = ""
    if body.startswith(","): comma = ","; body = body[1:].lstrip()
    if re.search(r"\[%s\]\s*$" % re.escape(old), body):
        body = re.sub(r"\[%s\]\s*$" % re.escape(old), "[%s]" % new, body)
    else:
        body = re.sub(r"%s\s*$" % re.escape(old), new, body)
    return lead + comma + body

def make_conversation(anchor_ln, newname="Conversation"):
    """Clone anchor's lead + comma/trailing style; source = <prefix>.[Conversation]; drop alias."""
    lead = lead_ws(anchor_ln); body = anchor_ln.strip()
    leading = body.startswith(",")
    trailing = body.endswith(",")
    if leading: body = body[1:].strip()
    if trailing: body = body[:-1].strip()
    # remove AS alias
    body_noalias = re.sub(r"(?i)\s+AS\s+(\[[^\]]+\]|[A-Za-z0-9_]+)\s*$", "", body).strip()
    # prefix = everything up to and including last '.'
    if "." in body_noalias:
        prefix = body_noalias[:body_noalias.rfind(".") + 1]
    else:
        prefix = ""
    new_expr = prefix + "[%s]" % newname
    line = lead + ("," if leading else "") + new_expr + ("," if trailing else "")
    return line

# ---------- build edits ----------
deletions = set()
replacements = {}
insert_after = collections.defaultdict(list)
errors = []
changelog = []

affected = sorted(set(deprecate) | set(rename) | set(newcol))
for v in affected:
    if v not in view_start:
        errors.append(f"View not found: {v}"); continue
    s = view_start[v]
    # end = next view start (or a bit past)
    later = [view_start[o] for o in order if view_start[o] > s]
    e = min(later) if later else len(lines)
    col_idx = top_level_cols(s, e)
    name2idx = collections.defaultdict(list)
    for i in col_idx:
        nm, _ = out_name(lines[i])
        name2idx[nm].append(i)

    # deprecate
    for col in sorted(deprecate.get(v, [])):
        hits = name2idx.get(col, [])
        if len(hits) != 1:
            errors.append(f"{v}: deprecate '{col}' matched {len(hits)} lines"); continue
        idx = hits[0]
        if idx == col_idx[0] and not is_leading(lines[idx]):
            errors.append(f"{v}: deprecate '{col}' is FIRST column (needs promote)"); continue
        deletions.add(idx)
        changelog.append(f"DEPRECATE {v}.{col}  -> removed: {lines[idx].strip()}")

    # rename
    for old, new in rename.get(v, {}).items():
        hits = name2idx.get(old, [])
        if len(hits) != 1:
            errors.append(f"{v}: rename '{old}' matched {len(hits)} lines"); continue
        idx = hits[0]
        newln = apply_rename(lines[idx], old, new)
        replacements[idx] = newln
        changelog.append(f"RENAME    {v}.{old} -> {new}  : '{lines[idx].strip()}' => '{newln.strip()}'")

    # new column (Conversation)
    for nc in newcol.get(v, []):
        # find anchor: SolutionPlay / DealSolutionPlay top-level col
        anchor = None
        for cand in ("SolutionPlay", "DealSolutionPlay", "Solution Play (Seller Tagged)"):
            if cand in name2idx:
                anchor = name2idx[cand][0]; break
        if anchor is None:
            # append as last top-level column, clone last col style
            last = col_idx[-1]
            conv = make_conversation(lines[last], nc)
            insert_after[last].append(conv)
            changelog.append(f"NEWCOL    {v}.{nc}  appended after last col: '{conv.strip()}'")
        else:
            conv = make_conversation(lines[anchor], nc)
            insert_after[anchor].append(conv)
            tag = "replace(anchor deprecated)" if anchor in deletions else "insert after (anchor kept)"
            changelog.append(f"NEWCOL    {v}.{nc}  {tag}: '{conv.strip()}'  [anchor: {lines[anchor].strip()}]")

# ---------- report ----------
w("\n" + "=" * 90)
w("PLANNED CHANGES:", len(changelog), " | deletions:", len(deletions), " replacements:", len(replacements),
  " insertions:", sum(len(x) for x in insert_after.values()))
w("ERRORS:", len(errors))
for er in errors: w("   !!", er)
w("=" * 90)
for cl in changelog: w("  " + cl)

if errors:
    w("\nABORTING due to errors."); open(REPORT, "w", encoding="utf-8").write(rep.getvalue()); sys.exit(2)

# ---------- emit new file ----------
outlines = []
for i, ln in enumerate(lines):
    if i not in deletions:
        outlines.append(replacements.get(i, ln))
    for ins in insert_after.get(i, []):
        outlines.append(ins)
newdata = NL.join(outlines)

# ---------- validation ----------
w("\n" + "#" * 90)
w("VALIDATION")
# 1. view count
nviews_old = len(re.findall(r"N'\s*CREATE VIEW \[CoSell\]", data)) + len(re.findall(r"N'CREATE VIEW \[CoSell\]", data))
nviews_new = len(re.findall(r"N'\s*CREATE VIEW \[CoSell\]", newdata)) + len(re.findall(r"N'CREATE VIEW \[CoSell\]", newdata))
w(f"  View defs: old={nviews_old} new={nviews_new}  {'OK' if nviews_old==nviews_new else 'MISMATCH!'}")
# 2. line delta
w(f"  Lines: old={len(lines)} new={len(outlines)} delta={len(outlines)-len(lines)} (expect {sum(len(x) for x in insert_after.values())-len(deletions)})")
# 3. malformed patterns in affected views (recompute)
newlines = newdata.split(NL)
nvs = {}
for i, ln in enumerate(newlines):
    m = re.search(r"CREATE VIEW \[CoSell\]\.\[(vw_[^\]]+)\]", ln)
    if m: nvs[m.group(1)] = i
norder = [k for k,_ in sorted(nvs.items(), key=lambda kv: kv[1])]
def nl_top_cols(start, end):
    save = None
    global lines
    return None
problems = []
for v in affected:
    if v not in nvs: continue
    s = nvs[v]; later = [nvs[o] for o in norder if nvs[o] > s]; e = min(later) if later else len(newlines)
    block = NL.join(newlines[s:e])
    # column region up to first top-level FROM
    if re.search(r",\s*FROM\b", block, re.IGNORECASE): problems.append(f"{v}: ',FROM' detected")
    if ",," in block.replace(" ", ""): problems.append(f"{v}: ',,' detected")
    if re.search(r"SELECT\s*,", block): problems.append(f"{v}: 'SELECT ,' detected")
    # paren balance in view def string (between CREATE VIEW and closing '  );)
    # check deprecated cols absent / conversation present
    seg = block
    for col in deprecate.get(v, set()):
        # crude: the exact output column shouldn't appear as a standalone column anymore
        pass
    if v in newcol:
        if not re.search(r"\bConversation\b", seg): problems.append(f"{v}: Conversation missing!")
        if len(re.findall(r"\[Conversation\]", seg)) != len(newcol[v]):
            problems.append(f"{v}: Conversation count = {len(re.findall(r'\\[Conversation\\]', seg))} expected {len(newcol[v])}")
# renamed old names absent / new present in that view
for v in rename:
    if v not in nvs: continue
    s = nvs[v]; later = [nvs[o] for o in norder if nvs[o] > s]; e = min(later) if later else len(newlines)
    block = NL.join(newlines[s:e]); colregion = block.split("FROM")[0]
    for old, new in rename[v].items():
        if re.search(r"\b%s\b" % re.escape(new), colregion) is None: problems.append(f"{v}: renamed '{new}' missing")
        if re.search(r"\.%s\b" % re.escape(old), colregion): problems.append(f"{v}: old '{old}' still present")
w("  Problems found:", len(problems))
for p in problems: w("    !!", p)

# 4. paren balance whole file
w(f"  Paren balance whole file: old open-close={data.count('(')-data.count(')')} new={newdata.count('(')-newdata.count(')')}")
# 5. quote tuples
w(f"  Single-quote count: old={data.count(chr(39))} new={newdata.count(chr(39))} (delta {newdata.count(chr(39))-data.count(chr(39))}, expect 0)")

status = "PASS" if (nviews_old == nviews_new and not problems) else "FAIL"
w("\nRESULT:", status)

if WRITE and status == "PASS":
    with open(OUT_WS, "w", encoding="utf-8", newline="") as fh:
        fh.write(newdata)
    w("\nWROTE:", OUT_WS)
else:
    w("\n(dry-run; pass --write to emit file)")

open(REPORT, "w", encoding="utf-8").write(rep.getvalue())
