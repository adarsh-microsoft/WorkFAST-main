import re, collections, io

dump = r"c:\WorkFAST-main\generated-content\gpsmart-views-excel-dump.txt"
with open(dump, "r", encoding="utf-8") as f:
    lines = f.read().splitlines()

# Split into sheets
sheets = {}
cur = None
for ln in lines:
    if ln.startswith("SHEET:"):
        cur = ln.split("SHEET:", 1)[1].strip()
        sheets[cur] = []
    elif cur is not None and ln.startswith("[R"):
        sheets[cur].append(ln)

def parse_rows(sheet_lines):
    rows = []
    for ln in sheet_lines:
        m = re.match(r"\[R(\d+)\]\s?(.*)", ln)
        if not m:
            continue
        rid = int(m.group(1))
        cells = [c.strip() for c in m.group(2).split(" | ")]
        rows.append((rid, cells))
    return rows

out = io.StringIO()
def w(*a):
    s = " ".join(str(x) for x in a)
    print(s); out.write(s + "\n")

for sheet_name in ["Views Tracker", "Views Tracker (Arch)"]:
    rows = parse_rows(sheets[sheet_name])
    header = rows[0][1]
    data = rows[1:]
    w("=" * 90)
    w("SHEET:", sheet_name)
    w("Header:", header)
    w("Total data rows:", len(data))

    # Filter CoSell
    cosell = [(rid, c) for rid, c in data if len(c) > 0 and c[0].strip().lower() == "cosell"]
    w("CoSell data rows:", len(cosell))

    # Change type distribution (col index 4)
    ct = collections.Counter()
    for rid, c in cosell:
        change = c[4].strip() if len(c) > 4 else "(none)"
        ct[change] += 1
    w("Change Type distribution (CoSell):")
    for k, v in ct.most_common():
        w(f"   {k!r}: {v}")

    # Distinct CoSell views touched
    views = collections.Counter()
    for rid, c in cosell:
        if len(c) > 1:
            views[c[1].strip()] += 1
    w("Distinct CoSell views in sheet:", len(views))

    # Show rows where change type is NOT 'No Change' — actionable ones
    actionable = [(rid, c) for rid, c in cosell if len(c) > 4 and c[4].strip().lower() not in ("no change", "")]
    w("Actionable CoSell rows (not 'No Change'):", len(actionable))
    w("")

out.write("\n\n")

# Detailed: For 'Views Tracker' sheet, dump all actionable CoSell rows grouped by change type
rows = parse_rows(sheets["Views Tracker"])
data = rows[1:]
cosell = [(rid, c) for rid, c in data if len(c) > 0 and c[0].strip().lower() == "cosell"]

by_change = collections.defaultdict(list)
for rid, c in cosell:
    change = c[4].strip() if len(c) > 4 else "(none)"
    by_change[change].append((rid, c))

w("#" * 90)
w("DETAIL: 'Views Tracker' sheet — actionable CoSell rows by change type")
w("Columns: Schema | View | Column | Datatype | ChangeType | NewView | NewColumn")
for change in sorted(by_change):
    if change.lower() == "no change":
        continue
    w("\n" + "=" * 80)
    w(f"CHANGE TYPE: {change}  (count={len(by_change[change])})")
    for rid, c in by_change[change]:
        view = c[1] if len(c) > 1 else ""
        col = c[2] if len(c) > 2 else ""
        dt = c[3] if len(c) > 3 else ""
        nv = c[5] if len(c) > 5 else ""
        nc = c[6] if len(c) > 6 else ""
        w(f"  R{rid}: {view} . {col} ({dt})  ->  NewView={nv!r} NewColumn={nc!r}")

with open(r"c:\WorkFAST-main\generated-content\gpsmart-cosell-changes-analysis.txt", "w", encoding="utf-8") as fh:
    fh.write(out.getvalue())
print("\n\nSaved analysis.")
