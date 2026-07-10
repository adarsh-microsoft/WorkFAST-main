"""
Smarter parsing: execute the notebook Python to extract shortcut definitions.
Define stub variables, then use eval/exec to build the shortcut dicts.
"""

import re, json, os

NOTEBOOK_PATH = r"c:\WorkFAST-main\generated-content\cosell-models\notebook-content.py"

with open(NOTEBOOK_PATH, "r", encoding="utf-8", errors="replace") as f:
    nb_text = f.read()

# ---- Set up stub variables so the notebook code can run ----
# Mock the variables that the notebook uses

MockVars = {
    "PublishSchemaName": "CoSell_Publish",
    "LatestPublishedSchemaName": "CoSellGold",
    "WorkspaceId_Stream": "mock-ws-cosell",
    "LakehouseId_Stream": "mock-lh-cosell",
    "WorkspaceId_reporting": "mock-ws-reporting",
    "LakehouseId_reporting": "mock-lh-reporting",
    "workspaceId_SalesReporting": "mock-ws-salesreporting",
    "lakehouseId_SalesReporting": "mock-lh-salesreporting",
    "workspaceId_PPRReporting": "mock-ws-pprreporting",
    "lakehouseId_PPRReporting": "mock-lh-pprreporting",
    "workspaceId_AzureReporting": "mock-ws-azurereporting",
    "lakehouseId_AzureReporting": "mock-lh-azurereporting",
    "workspaceId_PMReporting": "mock-ws-pmreporting",
    "lakehouseId_PMReporting": "mock-lh-pmreporting",
    "workspaceId_PartnerProgramsReporting": "mock-ws-partnerprogramsreporting",
    "lakehouseId_PartnerProgramsReporting": "mock-lh-partnerprogramsreporting",
    "workspaceId_SalesSecurity": "mock-ws-salessecurity",
    "lakehouseId_SalesSecurity": "mock-lh-salessecurity",
    "workspaceId_IAP": "mock-ws-iap",
    "lakehouseId_IAP": "mock-lh-iap",
}

# Stream name mapping (mocked)
STREAM_MAP = {
    "mock-lh-salesreporting": "SalesPowerBIReporting",
    "mock-lh-pprreporting": "PPRReporting",
    "mock-lh-azurereporting": "AzureReporting",
    "mock-lh-pmreporting": "PartnerMastering_Reporting",
    "mock-lh-partnerprogramsreporting": "PartnerPrograms_Reporting",
    "mock-lh-salessecurity": "MSSalesUserSecurity",
    "mock-lh-iap": "GPSIAPReporting",
    "mock-lh-cosell": "CoSell",
}

# ---- Extract Python code that defines shortcutDetails lists ----
# Find all lines between "[" and "]" that define shortcutDetails

shortcutDetails_blocks = re.findall(
    r'shortcutDetails[_\w]* = (\[.*?\n\])',
    nb_text,
    re.DOTALL
)

print(f"Found {len(shortcutDetails_blocks)} shortcutDetails blocks")

SHORTCUTS = {}  # shortcut_name -> {stream, schema, table}

for block_idx, block in enumerate(shortcutDetails_blocks):
    try:
        # Replace variables with their mock values
        code_str = block
        for var, val in MockVars.items():
            code_str = code_str.replace(var, f'"{val}"')
        
        # Handle f-strings naively (remove f prefix and hope it works)
        code_str = re.sub(r'f"', '"', code_str)
        
        # Wrap in a list assignment so we can eval it
        eval_code = f"result = {code_str}"
        
        try:
            local_ns = {"result": None}
            exec(eval_code, MockVars, local_ns)
            details = local_ns["result"]
        except Exception as e:
            print(f"  Block {block_idx}: eval failed: {e}")
            continue
        
        if not isinstance(details, list):
            print(f"  Block {block_idx}: not a list, skipped")
            continue
        
        # Extract shortcut mappings from the list
        for item in details:
            if isinstance(item, dict):
                name = item.get("ShortcutName")
                onelake = item.get("OneLake", {})
                if isinstance(onelake, dict):
                    path = onelake.get("path", "")
                    lh_id = onelake.get("itemId", "")
                    
                    # Resolve stream from lakehouse ID
                    stream = STREAM_MAP.get(lh_id, "Unknown")
                    
                    # Parse schema + table from path
                    # Path format: "Tables/Schema/Table" or "Tables/Schema/SubDir/Table"
                    parts = path.split("/") if isinstance(path, str) else []
                    schema = parts[1] if len(parts) > 1 else ""
                    table = parts[-1] if len(parts) > 2 else ""
                    
                    # Special: if LatestPublishedSchemaName (=CoSellGold), replace it
                    if schema == "CoSellGold" and stream == "CoSell":
                        pass  # Already correct
                    
                    if name and schema and table:
                        SHORTCUTS[name] = {"stream": stream, "schema": schema, "table": table}
        
        print(f"  Block {block_idx}: {len(details)} items processed, {sum(1 for i in details if isinstance(i, dict) and i.get('ShortcutName'))} shortcuts")
    
    except Exception as e:
        print(f"  Block {block_idx}: error: {e}")

print(f"\nTotal shortcuts extracted: {len(SHORTCUTS)}")

# Show sample
sample = list(SHORTCUTS.items())[:10]
for name, info in sample:
    print(f"  {name:40} -> {info['stream']:30} {info['schema']:15} {info['table']}")

# Save to JSON
out_json = r"c:\WorkFAST-main\generated-content\cosell-models\shortcuts_extracted.json"
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(SHORTCUTS, f, indent=2)
print(f"\nSaved: {out_json}")
