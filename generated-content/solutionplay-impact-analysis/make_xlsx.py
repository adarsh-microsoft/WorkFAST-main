import os
import pandas as pd

OUT_DIR = r"c:\WorkFAST-main\generated-content\solutionplay-impact-analysis"
OUT_PATH = os.path.join(OUT_DIR, "SolutionPlay_Impact_Analysis.xlsx")
os.makedirs(OUT_DIR, exist_ok=True)

COLUMNS = [
    "Input Schema", "Input Table", "Input Column", "Used Notebook Name",
    "Source Table Name", "Source Column Name", "Code Snippet",
    "Lakehouse Written Table Name", "Lakehouse Written Column Name",
    "Impact Level", "Dependency Path",
]

X = "solutionareataxonomynew (SolutionAreaMapping.xlsx)"
rows = [
    # ---- Base notebooks (origin) ----
    ["Silver", X, "L2SolutionPlayName", "Cosell_Silver_SolutionArea", X, "L2SolutionPlayName",
     'L2SolutionPlayName AS SolutionAreaLevel2 FROM solutionareataxonomynew -> writeTable("Silver_SolutionArea","Silver/SolutionArea",...)',
     "Silver/SolutionArea", "SolutionAreaLevel2", "Base", "Cosell_Silver_SolutionArea"],
    ["Silver", X, "L2SolutionPlayId", "Cosell_Silver_SolutionArea", X, "L2SolutionPlayId",
     'L2SolutionPlayId AS SolutionAreaLevel2ID FROM solutionareataxonomynew -> writeTable("Silver_SolutionArea","Silver/SolutionArea",...)',
     "Silver/SolutionArea", "SolutionAreaLevel2ID", "Base", "Cosell_Silver_SolutionArea"],
    ["Silver", X, "L2SolutionPlayId", "Cosell_Silver_SolutionSolutionAreaAssociation", X, "L2SolutionPlayId",
     'WHEN MT.L2SolutionPlayCaymanId = SSAA.SolutionAreaLevel2ID THEN MT.L2SolutionPlayId ... END AS SolutionAreaLevel2ID -> writeTable("UpdatedSolutionArea","Silver/SolutionSolutionAreaAssociation",...)',
     "Silver/SolutionSolutionAreaAssociation", "SolutionAreaLevel2ID", "Base", "Cosell_Silver_SolutionSolutionAreaAssociation"],
    ["Silver", X, "L2SolutionPlayCaymanId", "Cosell_Silver_SolutionSolutionAreaAssociation", X, "L2SolutionPlayCaymanId",
     'INNER JOIN solutionareataxonomynew MT ON (MT.L2SolutionPlayCaymanId = SSAA.SolutionAreaLevel2ID)  -- join key only',
     "Silver/SolutionSolutionAreaAssociation", "", "Base", "Cosell_Silver_SolutionSolutionAreaAssociation"],

    # ---- Direct impacts ----
    ["Silver", X, "L2SolutionPlayName", "Cosell_Gold_DimSolutionArea", "Silver/SolutionArea", "SolutionAreaLevel2",
     'getDataframe(...,"Silver/SolutionArea"); CASE WHEN (LOWER(SA.SolutionAreaLevel2)=\'null\' or SA.SolutionAreaLevel2 IS NULL) THEN \'Unknown\' ELSE SA.SolutionAreaLevel2 END AS SolutionPlay -> writeTable("DimSolutionArea", f"{GoldPublishSchema}/DimSolutionArea",...)',
     "{GoldPublishSchema}/DimSolutionArea", "SolutionPlay, SolutionAreaLevel2", "Direct",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimSolutionArea"],
    ["Silver", X, "L2SolutionPlayId", "Cosell_Gold_DimSolutionArea", "Silver/SolutionArea", "SolutionAreaLevel2ID",
     'SA.SolutionAreaLevel2ID (passthrough) -> writeTable("DimSolutionArea", f"{GoldPublishSchema}/DimSolutionArea",...)',
     "{GoldPublishSchema}/DimSolutionArea", "SolutionAreaLevel2ID", "Direct",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimSolutionArea"],
    ["Silver", X, "L2SolutionPlayName", "Cosell_Gold_DimCRMSolutionArea", "Silver/SolutionArea", "SolutionAreaLevel2",
     'IFNULL(SA.SolutionAreaLevel2, \'Unknown\') AS SolutionAreaLevel2 -> writeTable("DimCRMSolutionArea", f"{GoldPublishSchema}/DimCRMSolutionArea",...)',
     "{GoldPublishSchema}/DimCRMSolutionArea", "SolutionAreaLevel2", "Direct",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimCRMSolutionArea"],
    ["Silver", X, "L2SolutionPlayId", "Cosell_Gold_DimCRMSolutionArea", "Silver/SolutionArea", "SolutionAreaLevel2ID",
     'IFNULL(SA.SolutionAreaLevel2ID, \'Unknown\') AS SolutionAreaLevel2ID -> writeTable("DimCRMSolutionArea", f"{GoldPublishSchema}/DimCRMSolutionArea",...)',
     "{GoldPublishSchema}/DimCRMSolutionArea", "SolutionAreaLevel2ID", "Direct",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimCRMSolutionArea"],
    ["Silver", X, "L2SolutionPlayId", "Cosell_Gold_MapSolutionPractice", "Silver/SolutionSolutionAreaAssociation", "SolutionAreaLevel2ID",
     'getDataframe(...,"Silver/SolutionSolutionAreaAssociation"); LEFT JOIN Gold_DimSolutionArea DSA ON LOWER(DSA.SolutionAreaLevel2ID)=LOWER(SPSM.SolutionAreaLevel2ID) -> writeTable("Gold_FactLessSolutionPractice", f"{GoldPublishSchema}/MapSolutionPractice",...)',
     "{GoldPublishSchema}/MapSolutionPractice", "SolutionAreaKey (surrogate)", "Direct",
     "Cosell_Silver_SolutionSolutionAreaAssociation -> Cosell_Gold_MapSolutionPractice"],
    ["Silver", X, "L2SolutionPlayId", "Cosell_Gold_MapSolutionPracticeIndustryCountry", "Silver/SolutionSolutionAreaAssociation", "SolutionAreaLevel2ID",
     'INNER JOIN Bronze_SolutionSolutionAreaAssociation M ...; LEFT JOIN Gold_DimSolutionArea SA ON LOWER(SA.SolutionAreaLevel2ID)=LOWER(M.SolutionAreaLevel2ID) -> writeTable("MapSolutionPracticeIndustryCountry", f"{GoldPublishSchema}/MapSolutionPracticeIndustryCountry",...)',
     "{GoldPublishSchema}/MapSolutionPracticeIndustryCountry", "SolutionAreaKey (surrogate)", "Direct",
     "Cosell_Silver_SolutionSolutionAreaAssociation -> Cosell_Gold_MapSolutionPracticeIndustryCountry"],

    # ---- Indirect impacts (via Gold DimSolutionArea) ----
    ["Silver", X, "L2SolutionPlayName", "Cosell_Gold_FactSolution", "{GoldPublishSchema}/DimSolutionArea", "SolutionAreaLevel2",
     'getDataframe(...,f"{GoldPublishSchema}/DimSolutionArea"); SA.SolutionAreaLevel2 AS SolutionPlay (LEFT JOIN SA.SolutionAreaSKID=DS.SolutionAreaKey) -> writeTable("Gold_FactSolution", f"{GoldPublishSchema}/FactSolution",...)',
     "{GoldPublishSchema}/FactSolution", "SolutionPlay", "Indirect",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimSolutionArea -> Cosell_Gold_FactSolution"],
    ["Silver", X, "L2SolutionPlayName", "Cosell_Gold_DimCosellPrioritizedPartners", "{GoldPublishSchema}/DimSolutionArea", "SolutionAreaLevel2",
     'getDataframe(...,f"{GoldPublishSchema}/DimSolutionArea"); IFNULL(DS.SolutionAreaLevel2,\'Unknown\') AS SolutionPlay (join CP.SolutionAreaKey=DS.SolutionAreaSKID via MapSolutionPracticeIndustryCountry) -> writeTable("DimCosellPrioritizedPartners", f"{GoldPublishSchema}/DimCosellPrioritizedPartners",...)',
     "{GoldPublishSchema}/DimCosellPrioritizedPartners", "SolutionPlay", "Indirect",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimSolutionArea -> Cosell_Gold_DimCosellPrioritizedPartners"],
    ["Silver", X, "L2SolutionPlayName", "CoSell_Gold_Bridge_CoSellPrioritizedSolutionPracticeAndIndustryCountry", "{GoldPublishSchema}/DimSolutionArea", "SolutionAreaLevel2",
     'getDataframe(...,f"{GoldPublishSchema}/DimSolutionArea"); DSA.SolutionAreaLevel2 AS SolutionPlay (INNER JOIN DSA.SolutionAreaSKID=MSPIC.SolutionAreaKey) -> writeTable("Gold_Bridge_CoSellPrioritizedSolutionPracticeCountry", f"{GoldPublishSchema}/BridgeCoSellPrioritizedSolutionPracticeCountry",...)',
     "{GoldPublishSchema}/BridgeCoSellPrioritizedSolutionPracticeCountry", "SolutionPlay", "Indirect",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimSolutionArea -> CoSell_Gold_Bridge_CoSellPrioritizedSolutionPracticeAndIndustryCountry"],
    ["Silver", X, "L2SolutionPlayName", "Cosell_Gold_CustomSolutionAreaReporting", "{GoldPublishSchema}/DimSolutionArea", "SolutionAreaLevel2",
     'getDataframe(...,f"{GoldPublishSchema}/DimSolutionArea"); CASE WHEN (LOWER(DSA.SolutionAreaLevel2)=\'null\' or DSA.SolutionAreaLevel2 IS NULL) THEN \'Unknown\' ELSE DSA.SolutionAreaLevel2 END AS SolutionPlay -> writeTable("CustomSolutionAreaReporting", f"{GoldPublishSchema}/CustomSolutionAreaReporting",...)',
     "{GoldPublishSchema}/CustomSolutionAreaReporting", "SolutionPlay", "Indirect",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimSolutionArea -> Cosell_Gold_CustomSolutionAreaReporting"],
    ["Silver", X, "L2SolutionPlayName", "Cosell_Gold_FactFY20AllianceReadiness", "{GoldPublishSchema}/DimSolutionArea", "SolutionAreaLevel2",
     'getDataframe(...,f"{GoldPublishSchema}/DimSolutionArea"); LEFT JOIN Gold_DimSolutionArea SA ON LOWER(TRIM(CSK.TechnicalCapability))=LOWER(TRIM(SA.SolutionAreaLevel2)) -> IFNULL(SA.SolutionAreaSKID,0) AS SolutionAreaKey -> writeTable("FactFY20AllianceReadiness", f"{GoldPublishSchema}/FactFY20AllianceReadiness",...)',
     "{GoldPublishSchema}/FactFY20AllianceReadiness", "SolutionAreaKey (surrogate; join-only)", "Indirect",
     "Cosell_Silver_SolutionArea -> Cosell_Gold_DimSolutionArea -> Cosell_Gold_FactFY20AllianceReadiness"],
]

df = pd.DataFrame(rows, columns=COLUMNS)
with pd.ExcelWriter(OUT_PATH, engine="openpyxl") as xl:
    df.to_excel(xl, index=False, sheet_name="SolutionPlay Impact")
    ws = xl.sheets["SolutionPlay Impact"]
    for i, col in enumerate(COLUMNS, start=1):
        width = min(70, max(len(col) + 2, int(df[col].astype(str).map(len).max()) + 2))
        ws.column_dimensions[ws.cell(row=1, column=i).column_letter].width = width

print("Wrote", len(df), "rows to", OUT_PATH)
