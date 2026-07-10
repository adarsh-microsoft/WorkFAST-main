"""
Properly parse Reporting_DataTransfer.Notebook shortcuts.

Each shortcut is a dictionary:
{
    "ShortcutName": "X",
    "OneLake": {
        "workspaceId": VAR,
        "path": "Tables/..." or "Tables/"+LatestPublishedSchemaName+"/"+"TableName"
    }
}

Logic:
1. ShortcutName = Reporting Table Name
2. For Processing columns, check path:
   - If path contains "LatestPublishedSchemaName": Schema="CoSellGold", Table=last segment, Stream="CoSell"  
   - If literal path like "Tables/Gold/TableName": Schema=Gold, Table=TableName, Stream=from workspaceId var
"""

import re, json

NOTEBOOK_PATH = r"c:\WorkFAST-main\generated-content\cosell-models\notebook-content.py"

# Stream mapping
WORKSPACE_TO_STREAM = {
    "workspaceId_SalesReporting": "SalesPowerBIReporting",
    "workspaceId_PPRReporting": "PPRReporting",
    "workspaceId_AzureReporting": "AzureReporting",
    "workspaceId_PMReporting": "PartnerMastering_Reporting",
    "workspaceId_PartnerProgramsReporting": "PartnerPrograms_Reporting",
    "workspaceId_SalesSecurity": "MSSalesUserSecurity",
    "workspaceId_IAP": "GPSIAPReporting",
    "WorkspaceId_Stream": "CoSell",
    "WorkspaceId_reporting": "Cosell_Reporting",
}

with open(NOTEBOOK_PATH, "r", encoding="utf-8", errors="replace") as f:
    nb_text = f.read()

SHORTCUTS = {}

# Split into lines for processing
lines = nb_text.split('\n')

# State machine: track when we're inside a shortcut dict
i = 0
while i < len(lines):
    line = lines[i]
    
    # Look for ShortcutName
    shortcut_match = re.search(r'"ShortcutName"\s*:\s*"([^"]+)"', line)
    if shortcut_match:
        shortcut_name = shortcut_match.group(1).strip()
        
        # Now look for OneLake block within next 15 lines
        workspace_var = None
        path_line = None
        path_value = None
        
        for j in range(i, min(i + 15, len(lines))):
            curr_line = lines[j]
            
            # Find workspaceId (case insensitive)
            ws_match = re.search(r'"[wW]orkspaceId"\s*:\s*([A-Za-z0-9_]+)', curr_line)
            if ws_match:
                workspace_var = ws_match.group(1).strip().rstrip(',')
            
            # Find path - could be literal string or concatenation
            if '"path"' in curr_line:
                path_line = curr_line
                
                # Check if it's a literal path
                literal_match = re.search(r'"path"\s*:\s*"([^"]+)"', curr_line)
                if literal_match:
                    path_value = literal_match.group(1)
                
                # Check if it's a concatenation with LatestPublishedSchemaName
                elif 'LatestPublishedSchemaName' in curr_line:
                    # Extract the table name from the end
                    table_match = re.search(r'"([A-Za-z0-9_]+)"\s*$', curr_line.strip().rstrip('}').rstrip(','))
                    if table_match:
                        path_value = f"LATEST/{table_match.group(1)}"
                
                # Check if it's an f-string
                fstring_match = re.search(r'"path"\s*:\s*f"([^"]+)"', curr_line)
                if fstring_match:
                    path_value = fstring_match.group(1)
        
        # Now process if we have both
        if workspace_var and path_value:
            # Determine stream
            stream = WORKSPACE_TO_STREAM.get(workspace_var, "Unknown")
            
            # Parse path
            if path_value.startswith("LATEST/"):
                # LatestPublishedSchemaName case
                schema = "CoSellGold"
                table = path_value.split("/")[-1]
                stream = "CoSell"  # Override
            elif path_value.startswith("Tables/"):
                # Literal path: Tables/Schema/Table
                parts = path_value.split("/")
                if len(parts) >= 3:
                    schema = parts[1]
                    table = parts[-1]
                else:
                    schema = parts[1] if len(parts) >= 2 else ""
                    table = shortcut_name
            else:
                schema = ""
                table = shortcut_name
            
            SHORTCUTS[shortcut_name] = {
                "stream": stream,
                "schema": schema,
                "table": table,
            }
    
    i += 1

# Now handle list comprehensions: for table in ["A", "B", ...]
# These create shortcuts where ShortcutName = table and table name = table

# Find pattern: for table in [ ... followed by path with LatestPublishedSchemaName + table
list_comp_blocks = re.finditer(
    r'\*\[\s*\{[^}]*"ShortcutName"\s*:\s*table[^}]*\}[^]]*for\s+table\s+in\s+\[([^\]]+)\]',
    nb_text,
    re.DOTALL
)

for match in list_comp_blocks:
    block = match.group(0)
    tables_str = match.group(1)
    
    # Extract table names
    tables = re.findall(r'"([A-Za-z0-9_]+)"', tables_str)
    
    # Check if this block uses LatestPublishedSchemaName
    uses_latest = 'LatestPublishedSchemaName' in block
    
    # Find workspaceId in block
    ws_match = re.search(r'"[wW]orkspaceId"\s*:\s*([A-Za-z0-9_]+)', block)
    workspace_var = ws_match.group(1).strip().rstrip(',') if ws_match else "WorkspaceId_Stream"
    stream = WORKSPACE_TO_STREAM.get(workspace_var, "CoSell")
    
    for tbl in tables:
        if tbl not in SHORTCUTS:  # Don't overwrite explicit definitions
            if uses_latest:
                SHORTCUTS[tbl] = {
                    "stream": "CoSell",
                    "schema": "CoSellGold",
                    "table": tbl,
                }
            else:
                SHORTCUTS[tbl] = {
                    "stream": stream,
                    "schema": "Unknown",
                    "table": tbl,
                }

print(f"Extracted {len(SHORTCUTS)} shortcuts")
print()

# Show by stream
by_stream = {}
for name, info in SHORTCUTS.items():
    s = info["stream"]
    if s not in by_stream:
        by_stream[s] = []
    by_stream[s].append((name, info))

print("By Stream:")
for stream in sorted(by_stream.keys()):
    items = by_stream[stream]
    print(f"\n  {stream}: {len(items)} tables")
    for name, info in sorted(items)[:5]:
        print(f"    {name:40} -> {info['schema']:15} {info['table']}")
    if len(items) > 5:
        print(f"    ... and {len(items) - 5} more")

# Save
out_json = r"c:\WorkFAST-main\generated-content\cosell-models\shortcuts_final.json"
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(SHORTCUTS, f, indent=2)

print(f"\nSaved: {out_json}")
