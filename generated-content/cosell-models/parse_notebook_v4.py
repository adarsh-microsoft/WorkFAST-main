"""
Parse shortcut definitions by extracting dictionary blocks one at a time.
Look for patterns like:
  {
    "ShortcutName": "X",
    ...
    "OneLake": {
      "itemId": VAR,
      "path": "EXPR"
    }
  }
"""

import re, json

NOTEBOOK_PATH = r"c:\WorkFAST-main\generated-content\cosell-models\notebook-content.py"

with open(NOTEBOOK_PATH, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

SHORTCUTS = {}

# Go through the file line by line
i = 0
while i < len(lines):
    line = lines[i]
    
    # Look for ShortcutName
    if '"ShortcutName"' in line:
        shortcut_name = re.search(r'"ShortcutName"\s*:\s*["\']?([A-Za-z0-9_]+)["\']?', line)
        if shortcut_name:
            name = shortcut_name.group(1)
            
            # Now look for the corresponding OneLake section in the next ~15 lines
            stream = "Unknown"
            schema = ""
            table = ""
            
            for j in range(i, min(i + 20, len(lines))):
                # Look for itemId (tells us the stream)
                itemid_match = re.search(r'"itemId"\s*:\s*([A-Za-z0-9_, ]+)', lines[j])
                if itemid_match:
                    item_id_expr = itemid_match.group(1).strip()
                    # Simple mapping
                    if "SalesSecurity" in item_id_expr:
                        stream = "MSSalesUserSecurity"
                    elif "Stream" in item_id_expr:
                        stream = "CoSell"
                    elif "reporting" in item_id_expr.lower():
                        stream = "Cosell_Reporting"
                    elif "SalesReporting" in item_id_expr:
                        stream = "SalesPowerBIReporting"
                    elif "PPRReporting" in item_id_expr:
                        stream = "PPRReporting"
                    elif "AzureReporting" in item_id_expr:
                        stream = "AzureReporting"
                    elif "PMReporting" in item_id_expr:
                        stream = "PartnerMastering_Reporting"
                    elif "PartnerProgramsReporting" in item_id_expr:
                        stream = "PartnerPrograms_Reporting"
                    elif "IAP" in item_id_expr:
                        stream = "GPSIAPReporting"
                
                # Look for path
                path_match = re.search(r'"path"\s*:\s*"([^"]+)"', lines[j])
                if path_match:
                    path_expr = path_match.group(1)
                    
                    # Extract schema and table from path
                    # Path could be: Tables/Schema/Table or Tables/LatestPublishedSchemaName/Table or constructed with +
                    if "LatestPublishedSchemaName" in path_expr:
                        schema = "CoSellGold"
                        # Extract table name (last segment after the schema variable)
                        table_match = re.search(r'"([A-Za-z0-9_]+)"\s*$', lines[j])
                        if table_match:
                            table = table_match.group(1)
                        # Or look in next line
                        if not table and j + 1 < len(lines):
                            table_match = re.search(r'"([A-Za-z0-9_]+)"', lines[j + 1])
                            if table_match:
                                table = table_match.group(1)
                    else:
                        # Literal path: Tables/Schema/Table
                        parts = path_expr.split("/")
                        if len(parts) >= 3:
                            schema = parts[1]
                            table = parts[-1]
            
            if name and schema and table:
                SHORTCUTS[name] = {
                    "stream": stream,
                    "schema": schema,
                    "table": table,
                }
    
    i += 1

print(f"Extracted {len(SHORTCUTS)} shortcuts")

# Show all
for name in sorted(SHORTCUTS.keys()):
    info = SHORTCUTS[name]
    print(f"  {name:40} -> {info['stream']:30} {info['schema']:15} {info['table']}")

# Save
out_json = r"c:\WorkFAST-main\generated-content\cosell-models\shortcuts_mapping.json"
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(SHORTCUTS, f, indent=2, default=str)

print(f"\nSaved: {out_json}")
