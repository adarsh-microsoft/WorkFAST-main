"""
FINAL CORRECT parser for Reporting_DataTransfer.Notebook.

Strategy: Parse each shortcut dictionary as a complete block, ensuring we match
the workspaceId and path from the SAME OneLake sub-dict.
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

# Find each shortcut block: from { ... "ShortcutName": "X" ... "OneLake": { ... } ... }
# Use regex to find ShortcutName, then extract the enclosing dict

lines = nb_text.split('\n')

i = 0
while i < len(lines):
    line = lines[i]
    
    # Look for ShortcutName with a literal string value
    shortcut_match = re.search(r'"ShortcutName"\s*:\s*"([^"]+)"', line)
    if shortcut_match:
        shortcut_name = shortcut_match.group(1).strip()
        
        # Collect lines until we close the current dict (track braces)
        block_lines = []
        brace_count = 0
        started = False
        
        # Look backward to find the opening brace
        for k in range(i, max(0, i - 10), -1):
            if '{' in lines[k]:
                block_lines = [lines[k]]
                brace_count = lines[k].count('{') - lines[k].count('}')
                started = True
                start_line = k
                break
        
        # Now go forward to collect the rest of the block
        if started:
            for j in range(start_line + 1, min(start_line + 30, len(lines))):
                block_lines.append(lines[j])
                brace_count += lines[j].count('{') - lines[j].count('}')
                if brace_count <= 0:
                    break
        
        block_text = '\n'.join(block_lines)
        
        # Now extract workspaceId and path from this block
        ws_match = re.search(r'"[wW]orkspaceId"\s*:\s*([A-Za-z0-9_]+)', block_text)
        workspace_var = ws_match.group(1).strip().rstrip(',') if ws_match else None
        
        # Extract path
        path_value = None
        
        # Check for literal path: "path": "Tables/Schema/Table"
        literal_path = re.search(r'"path"\s*:\s*"([^"]+)"', block_text)
        if literal_path:
            path_value = ("literal", literal_path.group(1))
        
        # Check for f-string path: "path": f"Tables/..."
        fstring_path = re.search(r'"path"\s*:\s*f"([^"]+)"', block_text)
        if fstring_path:
            path_value = ("fstring", fstring_path.group(1))
        
        # Check for concatenation with LatestPublishedSchemaName
        if 'LatestPublishedSchemaName' in block_text and '"path"' in block_text:
            # Find the table name at the end of the path expression
            concat_match = re.search(r'"path"\s*:.*?"([A-Za-z0-9_]+)"\s*[}\n,]', block_text, re.DOTALL)
            if concat_match:
                table_from_concat = concat_match.group(1)
                path_value = ("latest", table_from_concat)
        
        # Process the path
        if workspace_var and path_value:
            path_type, path_str = path_value
            
            if path_type == "latest":
                # LatestPublishedSchemaName case
                stream = "CoSell"
                schema = "CoSellGold"
                table = path_str
            elif path_type == "literal" or path_type == "fstring":
                # Literal path like Tables/Gold/TableName
                parts = path_str.split("/")
                if len(parts) >= 3:
                    schema = parts[1]
                    table = parts[-1]
                elif len(parts) == 2:
                    schema = parts[1]
                    table = shortcut_name
                else:
                    schema = ""
                    table = shortcut_name
                
                # Stream from workspaceId
                stream = WORKSPACE_TO_STREAM.get(workspace_var, "Unknown")
            else:
                continue
            
            SHORTCUTS[shortcut_name] = {
                "stream": stream,
                "schema": schema,
                "table": table,
            }
    
    i += 1

# Handle list comprehensions: *[ { ... "ShortcutName": table ... } for table in [...] ]
# These use the same path pattern for all tables in the list

list_comp_pattern = re.compile(
    r'\*\s*\[\s*\{([^}]*"ShortcutName"\s*:\s*table[^}]*)\}[^]]*for\s+table\s+in\s+\[([^\]]+)\]',
    re.DOTALL
)

for match in list_comp_pattern.finditer(nb_text):
    template = match.group(1)
    tables_str = match.group(2)
    
    # Get all table names
    tables = re.findall(r'"([A-Za-z0-9_]+)"', tables_str)
    
    # Extract workspaceId from template
    ws_match = re.search(r'"[wW]orkspaceId"\s*:\s*([A-Za-z0-9_]+)', template)
    workspace_var = ws_match.group(1).strip().rstrip(',') if ws_match else "WorkspaceId_Stream"
    
    # Check if uses LatestPublishedSchemaName
    uses_latest = 'LatestPublishedSchemaName' in template
    
    stream = WORKSPACE_TO_STREAM.get(workspace_var, "CoSell") if not uses_latest else "CoSell"
    schema = "CoSellGold" if uses_latest else "Unknown"
    
    for tbl in tables:
        if tbl not in SHORTCUTS:
            SHORTCUTS[tbl] = {
                "stream": stream,
                "schema": schema,
                "table": tbl,
            }

print(f"Extracted {len(SHORTCUTS)} shortcuts")
print()

# Verify key mappings
test_cases = [
    ("BusinessSummary", "MSSalesUserSecurity", "MSSalesSecurity", "UserBusiness"),
    ("DimMSXProduct", "CoSell", "CoSellGold", "DimMSXProduct"),
    ("DimATU", "CoSell", "CoSellGold", "DimATU"),
    ("BridgeAzureAssociationPartner", "AzureReporting", "Gold", "BridgeAzureAssociationPartner"),
    ("DimAZPricingLevel", "PPRReporting", "Gold", "DimAZPricingLevel"),
    ("DimTime", "SalesPowerBIReporting", "Gold", "DimSalesTime"),
]

print("Verification against expected values:")
all_pass = True
for name, exp_stream, exp_schema, exp_table in test_cases:
    if name in SHORTCUTS:
        info = SHORTCUTS[name]
        stream_ok = info["stream"] == exp_stream
        schema_ok = info["schema"] == exp_schema
        table_ok = info["table"] == exp_table
        status = "✓" if (stream_ok and schema_ok and table_ok) else "✗"
        if not (stream_ok and schema_ok and table_ok):
            all_pass = False
        print(f"  {status} {name}: stream={info['stream']} (exp:{exp_stream}), schema={info['schema']} (exp:{exp_schema}), table={info['table']} (exp:{exp_table})")
    else:
        print(f"  ✗ {name}: NOT FOUND")
        all_pass = False

print()
if all_pass:
    print("All verifications passed!")
else:
    print("Some verifications failed - need to debug")

# Save
out_json = r"c:\WorkFAST-main\generated-content\cosell-models\shortcuts_final.json"
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(SHORTCUTS, f, indent=2)

print(f"\nSaved: {out_json}")

# Show summary by stream
by_stream = {}
for name, info in SHORTCUTS.items():
    s = info["stream"]
    if s not in by_stream:
        by_stream[s] = []
    by_stream[s].append(name)

print("\nBy Stream:")
for stream in sorted(by_stream.keys()):
    print(f"  {stream}: {len(by_stream[stream])} tables")
