import os, io, sys

try:
    import pandas as pd
except ImportError:
    print("pandas not installed")
    sys.exit(1)

path = r"c:\WorkFAST-main\in\GPSMart_views_FY27_localcopy.xlsx"

buf = io.StringIO()
def out(*a):
    s = " ".join(str(x) for x in a)
    print(s)
    buf.write(s + "\n")

xl = pd.ExcelFile(path, engine="xlrd")
out("Sheets:", xl.sheet_names)
for sheet in xl.sheet_names:
    out("=" * 100)
    out("SHEET:", sheet)
    df = xl.parse(sheet, header=None)
    out("Rows:", len(df), "Cols:", len(df.columns))
    out("-" * 100)
    # Print full content
    for ridx, row in df.iterrows():
        cells = []
        for c in df.columns:
            v = row[c]
            if pd.isna(v):
                cells.append("")
            else:
                cells.append(str(v))
        # only print rows that have any content
        if any(x.strip() for x in cells):
            out(f"[R{ridx}] " + " | ".join(cells))

with open(r"c:\WorkFAST-main\generated-content\gpsmart-views-excel-dump.txt", "w", encoding="utf-8") as fh:
    fh.write(buf.getvalue())
out("\nSaved to generated-content/gpsmart-views-excel-dump.txt")
