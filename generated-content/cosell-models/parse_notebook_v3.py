"""
Extract shortcut definitions from Reporting_DataTransfer.Notebook.
Parse the structure:
  ShortcutName -> OneLake.path + OneLake.itemId
"""

import re, json

NOTEBOOK_PATH = r"c:\WorkFAST-main\generated-content\cosell-models\notebook-content.py"

with open(NOTEBOOK_PATH, "r", encoding="utf-8", errors="replace") as f:
    nb_text = f.read()

# Stream ID to stream name mapping
LAKEHOUSE_TO_STREAM = {
    "workspaceId_SalesSecurity, lakehouseId_SalesSecurity": "MSSalesUserSecurity",
    "lakehouseId_SalesSecurity": "MSSalesUserSecurity",
    "WorkspaceId_Stream, LakehouseId_Stream": "CoSell",
    "LakehouseId_Stream": "CoSell",
    "LakehouseId_reporting": "Cosell_Reporting",
    "WorkspaceId_reporting, LakehouseId_reporting": "Cosell_Reporting",
    "lakehouseId_SalesReporting": "SalesPowerBIReporting",
    "workspaceId_SalesReporting, lakehouseId_SalesReporting": "SalesPowerBIReporting",
    "lakehouseId_PPRReporting": "PPRReporting",
    "workspaceId_PPRReporting, lakehouseId_PPRReporting": "PPRReporting",
    "lakehouseId_AzureReporting": "AzureReporting",
    "workspaceId_AzureReporting, lakehouseId_AzureReporting": "AzureReporting",
    "lakehouseId_PMReporting": "PartnerMastering_Reporting",
    "workspaceId_PMReporting, lakehouseId_PMReporting": "PartnerMastering_Reporting",
    "lakehouseId_PartnerProgramsReporting": "PartnerPrograms_Reporting",
    "workspaceId_PartnerProgramsReporting, lakehouseId_PartnerProgramsReporting": "PartnerPrograms_Reporting",
    "lakehouseId_IAP": "GPSIAPReporting",
    "workspaceId_IAP, lakehouseId_IAP": "GPSIAPReporting",
}

SHORTCUTS = {}  # shortcut_name -> {stream, schema, table}

# Parse shortcut dictionaries using a more flexible regex
# Match: "ShortcutName": "NAME" ... "path": "EXPR"
pattern = r'"ShortcutName"\s*:\s*["\']?([A-Za-z0-9_]+)["\']?.*?"itemId"\s*:\s*([A-Za-z0-9_, \+]+).*?"path"\s*:\s*"([^"]+)"'

for match in re.finditer(pattern, nb_text, re.DOTALL | re.IGNORECASE):
    shortcut_name = match.group(1).strip()
    item_id_expr = match.group(2).strip()
    path_expr = match.group(3).strip()
    
    # Resolve stream from itemId
    stream = "Unknown"
    for key, stream_name in LAKEHOUSE_TO_STREAM.items():
        if key.replace(" ", "") in item_id_expr.replace(" ", ""):
            stream = stream_name
            break
    
    # Parse path: could be "Tables/LatestPublishedSchemaName/TableName" or "Tables/Schema/TableName"
    # Also could include "+", so split on "+" and extract parts
    path_parts = re.findall(r'["\']([^"\']+)["\']|\+', path_expr)
    path_str = "".join(p for p in path_parts if p != "+").strip('"\'')
    
    # Split path by "/"
    segs = path_str.split("/")
    
    if len(segs) >= 3 and segs[0] == "Tables":
        schema_expr = segs[1]
        table_name = segs[-1]
        
        # Resolve schema: if it says "LatestPublishedSchemaName", use "CoSellGold"
        if "LatestPublishedSchemaName" in schema_expr:
            schema = "CoSellGold"
        else:
            schema = schema_expr
        
        SHORTCUTS[shortcut_name] = {
            "stream": stream,
            "schema": schema,
            "table": table_name,
        }

print(f"Extracted {len(SHORTCUTS)} shortcuts")

# Show sample
for name in sorted(SHORTCUTS.keys())[:15]:
    info = SHORTCUTS[name]
    print(f"  {name:40} -> {info['stream']:30} {info['schema']:15} {info['table']}")

# Save
out_json = r"c:\WorkFAST-main\generated-content\cosell-models\shortcuts_mapping.json"
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(SHORTCUTS, f, indent=2)

print(f"\nSaved: {out_json}")
