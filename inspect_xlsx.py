import os, sys, io
import pandas as pd

folder = r"C:\Users\v-adevashish\OneDrive - Microsoft\Desktop\SPECKIT_Implementation\Datafiles 1 (1)"
files = ["DimAccount.xlsx","DimCustomer.xlsx","DimDate.xlsx","DimEmployee.xlsx","DimFiscalMonth.xlsx","FactFinance.xlsx","FactInternetSales.xlsx","FactResellerSales.xlsx"]

buf = io.StringIO()
def out(*a):
    s = " ".join(str(x) for x in a)
    print(s)
    buf.write(s + "\n")

for f in files:
    path = os.path.join(folder, f)
    out("="*80)
    out("File:", f)
    if not os.path.exists(path):
        out("  MISSING:", path); continue
    try:
        xl = pd.ExcelFile(path)
        out("Sheets:", xl.sheet_names)
        primary = xl.sheet_names[0]
        df = xl.parse(primary)
        out("Primary sheet:", primary)
        out("Rows:", len(df), "Cols:", len(df.columns))
        out("Columns / dtypes:")
        for c, d in df.dtypes.items():
            out(f"  - {c}: {d}")
        out("Sample (first 3 rows):")
        if len(df.columns) > 10:
            out("  [wide table - showing column names only above]")
        else:
            sample = df.head(3).to_string(index=False, max_colwidth=30)
            for line in sample.splitlines():
                out("  " + line)
    except Exception as e:
        out("  ERROR:", e)

with open(r"C:\WorkFAST-main\speckit-excel-schema.txt","w",encoding="utf-8") as fh:
    fh.write(buf.getvalue())
out("\nSaved report to C:\\WorkFAST-main\\speckit-excel-schema.txt")
