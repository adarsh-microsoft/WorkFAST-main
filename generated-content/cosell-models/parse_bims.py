import json, re, os, sys

BASE = r"c:\Users\v-adevashish\AppData\Roaming\Code\User\workspaceStorage\f80fccdc8f3dba950386632b8d809d58\GitHub.copilot-chat\chat-session-resources\8818408f-6be5-426b-849a-0691019b79b3"

# Map: bim file name -> temp content path captured from the ADO repo reads
FILES = {
    "CoMarketingModel.bim":                          os.path.join(BASE, "toolu_0191g9XVZ8Au1Yt2oZeRsh6W__vscode-1781370346631", "content.json"),
    "CoSellSemanticModel.bim":                       r"c:\WorkFAST-main\generated-content\cosell-models\CoSellSemanticModel.bim",
    "MRoB Model.bim":                                os.path.join(BASE, "toolu_01TGbXSpTBaUtqLMdoPttDBK__vscode-1781370346634", "content.json"),
    "PSA_Impact_Dataset.bim":                        os.path.join(BASE, "toolu_01LQaMG17oXirpLbNLAY1CFg__vscode-1781370346635", "content.json"),
    "Partner Planning and Transition Dataset.bim":   os.path.join(BASE, "toolu_019jJGg6u9mqX3T19LfeXXZ9__vscode-1781370346636", "content.json"),
    "PartnerSharingModel.bim":                       os.path.join(BASE, "toolu_01TYfmiAVjXjy655utjZ2Mwc__vscode-1781370346637", "content.json"),
    "TPP_Dataset_Model.bim":                         os.path.join(BASE, "toolu_01RBNQApYE4W2LM1ZSDMKZZc__vscode-1781370346639", "content.json"),
    "UsageMetricReport.bim":                         os.path.join(BASE, "toolu_01BqQLDByiX9755HJwgHRTMo__vscode-1781370346638", "content.json"),
    "majorsSemanticModel.bim":                       os.path.join(BASE, "toolu_01NhuVTTRHBRzCGjzX8EbssK__vscode-1781370346640", "content.json"),
}

TAG_RE = re.compile(r"^\[(?P<schema>[^\]]+)\]\.\[(?P<table>[^\]]+)\]$")

def load_json(path):
    # Robust to BOM / UTF-16
    for enc in ("utf-8-sig", "utf-16", "utf-8"):
        try:
            with open(path, "r", encoding=enc) as f:
                return json.load(f)
        except Exception:
            continue
    # last resort: read bytes and strip
    with open(path, "rb") as f:
        raw = f.read()
    return json.loads(raw.decode("utf-8", errors="replace").lstrip("\ufeff"))

def partition_info(tbl):
    parts = tbl.get("partitions") or []
    if not parts:
        return {"mode": None, "sourceType": None, "entityName": None, "schemaName": None, "exprSource": None}
    p = parts[0]
    src = p.get("source") or {}
    return {
        "mode": p.get("mode"),
        "sourceType": src.get("type"),
        "entityName": src.get("entityName"),
        "schemaName": src.get("schemaName"),
        "exprSource": src.get("expressionSource"),
    }

result = {"models": [], "errors": []}

for bim_name, path in FILES.items():
    if not os.path.exists(path):
        result["errors"].append({"model": bim_name, "error": f"temp file missing: {path}"})
        continue
    try:
        data = load_json(path)
    except Exception as e:
        result["errors"].append({"model": bim_name, "error": f"json parse failed: {e}"})
        continue

    model_node = data.get("model") or {}
    tables = model_node.get("tables") or []
    model_entry = {
        "bimFile": bim_name,
        "modelName": data.get("name") or bim_name.replace(".bim", ""),
        "compatibilityLevel": data.get("compatibilityLevel"),
        "tableCount": 0,
        "tables": [],
    }
    for t in tables:
        name = t.get("name")
        slt = t.get("sourceLineageTag")
        pinfo = partition_info(t)
        schema = src_table = None
        if isinstance(slt, str):
            m = TAG_RE.match(slt.strip())
            if m:
                schema = m.group("schema")
                src_table = m.group("table")
        # fallback to partition entity/schema for Direct Lake when no table-level tag matched
        if schema is None and pinfo["schemaName"] and pinfo["entityName"]:
            schema = pinfo["schemaName"]
            src_table = pinfo["entityName"]

        is_calc = (pinfo["sourceType"] in ("calculated", "calculationGroup")) or (slt is None and pinfo["entityName"] is None and pinfo["schemaName"] is None)

        model_entry["tables"].append({
            "table": name,
            "sourceLineageTag": slt,
            "schema": schema,
            "sourceTable": src_table,
            "partitionMode": pinfo["mode"],
            "sourceType": pinfo["sourceType"],
            "entityName": pinfo["entityName"],
            "schemaName": pinfo["schemaName"],
            "isCalculated": bool(is_calc),
        })
    model_entry["tableCount"] = len(model_entry["tables"])
    result["models"].append(model_entry)

out_dir = r"c:\WorkFAST-main\generated-content\cosell-models"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "inventory.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

# Print compact summary
print("=== CoSell /Model BIM inventory (branch: master) ===")
total_tables = 0
total_with_tag = 0
schemas = {}
for me in result["models"]:
    total_tables += me["tableCount"]
    with_tag = sum(1 for t in me["tables"] if t["sourceLineageTag"])
    calc = sum(1 for t in me["tables"] if t["isCalculated"])
    total_with_tag += with_tag
    model_schemas = sorted({t["schema"] for t in me["tables"] if t["schema"]})
    for s in model_schemas:
        schemas[s] = schemas.get(s, 0) + sum(1 for t in me["tables"] if t["schema"] == s)
    print(f"\n## {me['bimFile']}  (model name: {me['modelName']})")
    print(f"   tables={me['tableCount']}  with sourceLineageTag={with_tag}  calculated/no-tag={calc}")
    print(f"   schemas referenced: {', '.join(model_schemas) if model_schemas else '(none)'}")

print("\n=== ROLL-UP ===")
print(f"Models: {len(result['models'])}")
print(f"Total tables: {total_tables}")
print(f"Tables with sourceLineageTag (or DL entity): {total_with_tag}")
print(f"Distinct schemas across all models: {', '.join(f'{k} ({v})' for k,v in sorted(schemas.items()))}")
if result["errors"]:
    print("\nERRORS:")
    for e in result["errors"]:
        print(f"  - {e['model']}: {e['error']}")
print(f"\nWrote: {out_path}")
