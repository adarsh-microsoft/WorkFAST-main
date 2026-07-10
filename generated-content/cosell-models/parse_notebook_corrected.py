"""
Correctly parse Reporting_DataTransfer.Notebook for shortcut definitions.

Logic:
1. ShortcutName = Reporting Table Name
2. Check OneLake.path:
   - If contains "LatestPublishedSchemaName": Schema = "CoSellGold", Stream = "CoSell", Table = last segment
   - Else (literal path): Schema = second segment, Table = last segment, Stream = trace workspaceId variable

Stream mappings from notebook:
  workspaceId_SalesReporting      -> SalesPowerBIReporting
  workspaceId_PPRReporting        -> PPRReporting
  workspaceId_AzureReporting      -> AzureReporting
  workspaceId_PMReporting         -> PartnerMastering_Reporting
  workspaceId_PartnerProgramsReporting -> PartnerPrograms_Reporting
  workspaceId_SalesSecurity       -> MSSalesUserSecurity
  workspaceId_IAP                 -> GPSIAPReporting
  WorkspaceId_Stream              -> CoSell
  WorkspaceId_reporting           -> Cosell_Reporting
"""

import re, json

NOTEBOOK_PATH = r"c:\WorkFAST-main\generated-content\cosell-models\notebook-content.py"

# Stream mapping: workspaceId variable -> stream name
WORKSPACE_TO_STREAM = {
    "workspaceId_SalesReporting": "SalesPowerBIReporting",
    "lakehouseId_SalesReporting": "SalesPowerBIReporting",
    "workspaceId_PPRReporting": "PPRReporting",
    "lakehouseId_PPRReporting": "PPRReporting",
    "workspaceId_AzureReporting": "AzureReporting",
    "lakehouseId_AzureReporting": "AzureReporting",
    "workspaceId_PMReporting": "PartnerMastering_Reporting",
    "lakehouseId_PMReporting": "PartnerMastering_Reporting",
    "workspaceId_PartnerProgramsReporting": "PartnerPrograms_Reporting",
    "lakehouseId_PartnerProgramsReporting": "PartnerPrograms_Reporting",
    "workspaceId_SalesSecurity": "MSSalesUserSecurity",
    "lakehouseId_SalesSecurity": "MSSalesUserSecurity",
    "workspaceId_IAP": "GPSIAPReporting",
    "lakehouseId_IAP": "GPSIAPReporting",
    "WorkspaceId_Stream": "CoSell",
    "LakehouseId_Stream": "CoSell",
    "WorkspaceId_reporting": "Cosell_Reporting",
    "LakehouseId_reporting": "Cosell_Reporting",
}

with open(NOTEBOOK_PATH, "r", encoding="utf-8", errors="replace") as f:
    nb_text = f.read()

SHORTCUTS = {}  # shortcut_name -> {stream, schema, table}

# Find all shortcut definition blocks
# Pattern: Look for ShortcutName, then find corresponding workspaceId and path within the same dict block

lines = nb_text.split('\n')
i = 0
while i < len(lines):
    line = lines[i]
    
    # Look for "ShortcutName": "X" or "ShortcutName": X (variable)
    shortcut_match = re.search(r'"ShortcutName"\s*:\s*"?([A-Za-z0-9_\s]+)"?', line)
    if shortcut_match:
        shortcut_name = shortcut_match.group(1).strip().strip('"').strip(',')
        
        # Skip if it's a variable reference like "table" (from list comprehension)
        if shortcut_name.lower() in ['table', 'x', 'item']:
            i += 1
            continue
        
        # Search forward (within ~25 lines) for OneLake block with workspaceId and path
        workspace_var = None
        path_expr = None
        
        for j in range(i, min(i + 25, len(lines))):
            # Look for workspaceId
            ws_match = re.search(r'"[Ww]orkspaceId"\s*:\s*([A-Za-z0-9_]+)', lines[j])
            if ws_match:
                workspace_var = ws_match.group(1).strip()
            
            # Look for path - can be a string or f-string
            path_match = re.search(r'"path"\s*:\s*(?:f)?"([^"]+)"', lines[j])
            if path_match:
                path_expr = path_match.group(1).strip()
            
            # Also check for path with string concatenation
            if '"path"' in lines[j] and 'LatestPublishedSchemaName' in lines[j]:
                # Extract the table name from the concatenation
                table_match = re.search(r'"([A-Za-z0-9_]+)"\s*$', lines[j].strip().rstrip(','))
                if table_match:
                    path_expr = f"Tables/LatestPublishedSchemaName/{table_match.group(1)}"
        
        # Now process if we found both workspace and path
        if workspace_var and path_expr:
            # Determine stream from workspace variable
            stream = WORKSPACE_TO_STREAM.get(workspace_var, "Unknown")
            
            # Parse path for schema and table
            if "LatestPublishedSchemaName" in path_expr:
                # CoSell stream, CoSellGold schema
                schema = "CoSellGold"
                # Extract table name - last segment or from the concatenation
                parts = path_expr.replace("LatestPublishedSchemaName", "CoSellGold").split("/")
                table = parts[-1] if parts else shortcut_name
                stream = "CoSell"  # Override stream for LatestPublishedSchemaName
            else:
                # Literal path like "Tables/Gold/TableName"
                parts = path_expr.split("/")
                if len(parts) >= 3:
                    schema = parts[1]  # Second segment is schema
                    table = parts[-1]  # Last segment is table
                else:
                    schema = ""
                    table = shortcut_name
            
            if shortcut_name and schema and table:
                SHORTCUTS[shortcut_name] = {
                    "stream": stream,
                    "schema": schema,
                    "table": table,
                    "workspace_var": workspace_var,
                    "path": path_expr,
                }
    
    i += 1

# Also handle list comprehensions - find tables listed in for loops
# Pattern: for table in ["Table1", "Table2", ...]
list_comp_pattern = re.finditer(
    r'for\s+table\s+in\s+\[([^\]]+)\]',
    nb_text,
    re.DOTALL
)

for match in list_comp_pattern:
    table_list_str = match.group(1)
    # Extract table names
    table_names = re.findall(r'"([A-Za-z0-9_]+)"', table_list_str)
    
    # Find the context - what workspace/path pattern is used
    # Look backward and forward for workspaceId and path pattern
    start_pos = match.start()
    context = nb_text[max(0, start_pos - 500):start_pos + 1000]
    
    # Find workspace
    ws_match = re.search(r'"[Ww]orkspaceId"\s*:\s*([A-Za-z0-9_]+)', context)
    workspace_var = ws_match.group(1) if ws_match else "WorkspaceId_Stream"
    
    # Find path pattern
    path_match = re.search(r'"path"\s*:\s*"([^"]+)"', context)
    
    # Check if LatestPublishedSchemaName is in the path
    has_latest = "LatestPublishedSchemaName" in context[context.find('"path"'):context.find('"path"')+200] if '"path"' in context else False
    
    stream = WORKSPACE_TO_STREAM.get(workspace_var, "CoSell")
    
    for tbl in table_names:
        if tbl not in SHORTCUTS:
            if has_latest or workspace_var in ["WorkspaceId_Stream", "LakehouseId_Stream"]:
                SHORTCUTS[tbl] = {
                    "stream": "CoSell",
                    "schema": "CoSellGold",
                    "table": tbl,
                    "workspace_var": workspace_var,
                    "path": f"Tables/LatestPublishedSchemaName/{tbl}",
                }
            else:
                # Need to determine schema from context
                if path_match:
                    parts = path_match.group(1).split("/")
                    schema = parts[1] if len(parts) >= 2 else "Unknown"
                else:
                    schema = "Unknown"
                
                SHORTCUTS[tbl] = {
                    "stream": stream,
                    "schema": schema,
                    "table": tbl,
                    "workspace_var": workspace_var,
                    "path": f"Tables/{schema}/{tbl}",
                }

print(f"Extracted {len(SHORTCUTS)} shortcuts")
print()

# Group by stream
by_stream = {}
for name, info in SHORTCUTS.items():
    stream = info["stream"]
    if stream not in by_stream:
        by_stream[stream] = []
    by_stream[stream].append(name)

print("By Stream:")
for stream, tables in sorted(by_stream.items()):
    print(f"  {stream}: {len(tables)} tables")

print()
print("Sample shortcuts:")
for name in sorted(SHORTCUTS.keys())[:20]:
    info = SHORTCUTS[name]
    print(f"  {name:40} -> {info['stream']:30} {info['schema']:15} {info['table']}")

# Save
out_json = r"c:\WorkFAST-main\generated-content\cosell-models\shortcuts_corrected.json"
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(SHORTCUTS, f, indent=2)

print(f"\nSaved: {out_json}")
