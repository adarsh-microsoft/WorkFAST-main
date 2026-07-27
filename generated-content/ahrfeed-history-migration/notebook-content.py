# Fabric notebook source

# METADATA ********************

# META {
# META   "kernel_info": {
# META     "name": "synapse_pyspark"
# META   },
# META   "dependencies": {}
# META }

# MARKDOWN ********************

# ###### Project Name: CoSell
# ###### Purpose: (DND) Test notebook - migration of ADLS Refresh_Hist_AHRFeed_History.py to Fabric.
# ###### Populates Gold HistoryAHRFeedAudit and HistoryAHRFeedTable by appending a monthly snapshot
# ###### (stamped with FMCloseDate) to the accumulated history as NEW ROWS. Existing rows are never mutated.
# ###### Variable: "IstSnapshot" (default, monthly auto-snapshot on days 5-9) or "UpdateSnapshot" (re-take current month now).

# CELL ********************

%run CommonUtilityFunctions

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Initializes variables for the CoSell stream and Gold stage layer.
StreamName = 'CoSell'
StageLayer = 'Gold'

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Retrieves the workspace and lakehouse IDs based on the StreamName for use in later steps.
WorkspaceId = GetWorkspaceIDLakehouseID(StreamName)['WorkspaceID']
LakehouseId = GetWorkspaceIDLakehouseID(StreamName)['LakehouseID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Checks the notebook's status and exits based on specific status codes.
NotebookName = fabric.resolve_item_name(notebookutils.runtime.context['currentNotebookId'])
Result = GetNotebookStatus(NotebookName, StreamName, StageLayer)
if '0' in Result:
    mssparkutils.notebook.exit("0")
elif '-1' in Result:
    System.exit(-1)
elif '2' in Result:
    mssparkutils.notebook.exit("2")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Fetches the publish schema for the CoSell stream in the Gold stage layer.
GoldPublishSchema = GetPublishSchema(WorkspaceId, LakehouseId, StreamName, StageLayer)
# Last COMPLETED publish schema. The current GoldPublishSchema is freshly created each cycle and does NOT yet
# contain the HistoryAHRFeed* tables (this notebook writes them), so the prior accumulated history is read from
# here. Facts are still read from, and the output is still written to, the current GoldPublishSchema.
GoldLatestPublishedSchema = GetLatestPublishedSchema(WorkspaceId, LakehouseId, StreamName, StageLayer)
print(f"GoldPublishSchema={GoldPublishSchema}, GoldLatestPublishedSchema={GoldLatestPublishedSchema}")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Source temp views (facts = current fiscal year; Silver history = seed accumulated by the ADLS job through FY25).
getDataframe(WorkspaceId, LakehouseId, f"{GoldPublishSchema}/FactAHRFeedAudit").createOrReplaceTempView("Gold_FactAHRFeedAudit")
getDataframe(WorkspaceId, LakehouseId, "Silver/HistoryAHRFeedAuditHistory").createOrReplaceTempView("Hist_AHRFeed_Audit_History")

getDataframe(WorkspaceId, LakehouseId, f"{GoldPublishSchema}/FactAHRFeedTable").createOrReplaceTempView("Gold_FactAHRFeedTable")
getDataframe(WorkspaceId, LakehouseId, "Silver/HistoryAHRFeedTableHistory").createOrReplaceTempView("Silver_HistoryAHRFeedTableHistory")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

import os

# DBTITLE 1, AHRSnapshotVariable
# "IstSnapshot"   -> monthly behaviour: append the snapshot only on days 5-9 and only if not already taken for this FMCloseDate.
# "UpdateSnapshot" -> (re)take the current month's snapshot right now (delete current FMCloseDate rows, then append). Use this to seed/test.
os.environ["AHRSnapshotVariable"] = "UpdateSnapshot"
Variable = os.getenv("AHRSnapshotVariable", "IstSnapshot")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

from pyspark.sql import functions as F

# FMCloseDate = the snapshot date (previous FM close), identical to the ADLS logic.
FMCloseDate = spark.sql("""
    SELECT CASE
        WHEN MONTH(CURRENT_DATE()) IN (1,3,5,7,8,10,12)
            THEN TO_DATE(TO_UTC_TIMESTAMP(ADD_MONTHS(LAST_DAY(CURRENT_DATE()), -1), 'PST'))
        WHEN MONTH(CURRENT_DATE()) IN (4,6,9,11)
            THEN TO_DATE(TO_UTC_TIMESTAMP(DATE_ADD(ADD_MONTHS(LAST_DAY(CURRENT_DATE()), -1), 1), 'PST'))
        ELSE CAST(CONCAT(YEAR(CURRENT_DATE()), '-01-31') AS DATE)
    END AS FMCloseDate
""").collect()[0][0]

cur_fmclose = str(FMCloseDate)
print(f"FMCloseDate (snapshot date) = {cur_fmclose}")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Current UTC day of month (drives the IstSnapshot 5-9 window, same as ADLS).
import datetime
d = datetime.datetime.utcnow()
day_part_value = int(d.strftime("%d"))
print(f"day_part_value = {day_part_value}")

# Fiscal-year rollover guard (fiscal year runs Jul-Jun, labelled by the calendar year it ends in).
# A snapshot whose FMCloseDate belongs to an ALREADY-CLOSED fiscal year must never be overwritten,
# because the fact table only holds the current fiscal year and will have rolled past it.
def fiscal_year_of(dstr):
    y, m = int(str(dstr)[0:4]), int(str(dstr)[5:7])
    return y + 1 if m >= 7 else y

fy_today = d.year + 1 if d.month >= 7 else d.year
fy_close = fiscal_year_of(cur_fmclose)
is_closed_prior_fy = fy_close < fy_today
print(f"fy_close(FMCloseDate)={fy_close}, fy_today={fy_today}, is_closed_prior_fy={is_closed_prior_fy}")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Audit snapshot from the current fact, stamped with FMCloseDate (ADLS AHRFeed_Audit_TimeStamp).
# Note: ServiceCompGroupName is aliased to ServiceCompGrouping to match the accumulated history schema.
spark.sql(f"""
    SELECT
        ACR,
        ApprovalDate,
        ApprovalFiscalMonth,
        InvalidEligibility_Audit,
        MSXCRMAccountID,
        MSXCRMAccountName,
        GPSCRMPartnerID,
        GPSCRMPartnerID_Audit,
        GPSCRMPartnerName,
        PartnerOneSubID,
        PartnerOneSubID_Audit,
        PartnerTPID,
        PartnerTPIDName,
        PartnerTPIDSegment,
        PartnerTPIDSubsidiary,
        PSXDealID,
        'Yes' AS ScorecardEligible,
        ServiceCompGroupName AS ServiceCompGrouping,
        TPAccountID,
        TPAccountName,
        TPAccountSegment,
        TPAccountSubsidiary,
        IsPartnerReportedACR,
        IsMarketplaceDealReg,
        ResourceGUID,
        '{cur_fmclose}' AS FMCloseDate
    FROM Gold_FactAHRFeedAudit
""").createOrReplaceTempView("AHRFeed_Audit_TimeStamp")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Table snapshot from the current fact, stamped with FMCloseDate (ADLS AHRFeedTable_TimeStamp).
spark.sql(f"""
    SELECT
        FiscalMonth,
        PartnerOneSubID,
        PartnerTPID,
        'Yes' AS ScorecardEligible,
        ServiceCompGroupName AS ServiceCompGrouping,
        SubDistrict,
        SubSegment,
        Subsidiary,
        TotalACR,
        TPAccountName,
        TPID,
        IsPartnerReportedACR,
        IsMarketplaceDealReg,
        ResourceGUID,
        '{cur_fmclose}' AS FMCloseDate
    FROM Gold_FactAHRFeedTable
""").createOrReplaceTempView("AHRFeedTable_TimeStamp")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Accumulation base loader.
# ADLS reads the PRIOR PUBLISHED history and INSERT INTO it. In Fabric the prior published output is the
# existing Gold table; the Silver history is the first-run seed. We pick Gold once real monthly snapshots
# (FMCloseDate newer than the Silver seed max) have started accumulating there, otherwise the Silver seed.
def load_accumulation_base(seed_view, gold_relative_path):
    seed_df = spark.table(seed_view)
    seed_max = seed_df.agg(F.max(F.col("FMCloseDate").cast("string"))).collect()[0][0]
    try:
        gold_df = getDataframe(WorkspaceId, LakehouseId, gold_relative_path)
        if "FMCloseDate" in gold_df.columns and seed_max is not None:
            newer = gold_df.filter(F.col("FMCloseDate").cast("string") > F.lit(seed_max)).limit(1).count()
            if newer > 0:
                print(f"{gold_relative_path}: accumulating on existing Gold history (seed_max={seed_max}).")
                return gold_df
        print(f"{gold_relative_path}: seeding from Silver '{seed_view}' (seed_max={seed_max}).")
    except Exception as e:
        print(f"{gold_relative_path}: Gold not readable ({e}); seeding from Silver '{seed_view}'.")
    return seed_df

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Snapshot logic for HistoryAHRFeedAudit -> final view Hist_AHRFeed_Audit_Test.
audit_base = load_accumulation_base("Hist_AHRFeed_Audit_History", f"{GoldLatestPublishedSchema}/HistoryAHRFeedAudit")
audit_snap = spark.table("AHRFeed_Audit_TimeStamp")

# Normalise FMCloseDate to string on both sides so filters/unions are type-safe.
audit_base = audit_base.withColumn("FMCloseDate", F.col("FMCloseDate").cast("string"))
audit_snap = audit_snap.withColumn("FMCloseDate", F.col("FMCloseDate").cast("string"))

# Surface any schema drift between the accumulated history and the new snapshot.
if set(audit_base.columns) != set(audit_snap.columns):
    print(f"Audit schema drift -> only in base: {set(audit_base.columns) - set(audit_snap.columns)}; "
          f"only in snapshot: {set(audit_snap.columns) - set(audit_base.columns)}")

audit_has_current = audit_base.filter(F.col("FMCloseDate") == F.lit(cur_fmclose)).limit(1).count() > 0

if Variable == 'IstSnapshot':
    if 4 < day_part_value < 10 and not audit_has_current:
        audit_result = audit_base.unionByName(audit_snap, allowMissingColumns=True)
        print("Audit: appended new snapshot (IstSnapshot).")
    else:
        audit_result = audit_base
        print("Audit: no change (outside 5-9 window or snapshot already exists).")
elif Variable == 'UpdateSnapshot':
    if is_closed_prior_fy and audit_has_current:
        # Closed prior-FY snapshot already banked -> immutable; never overwrite (protects e.g. FY26 2026-06-30
        # from being clobbered once the fact has rolled to the next fiscal year).
        audit_result = audit_base
        print(f"Audit: {cur_fmclose} is a closed prior FY already snapshotted -> preserved, no overwrite.")
    else:
        audit_result = audit_base.filter(F.col("FMCloseDate") != F.lit(cur_fmclose)).unionByName(audit_snap, allowMissingColumns=True)
        print("Audit: replaced/added current-month snapshot (UpdateSnapshot).")
else:
    audit_result = audit_base
    print(f"Audit: unknown Variable '{Variable}', no change.")

audit_result.createOrReplaceTempView("Hist_AHRFeed_Audit_Test")
print(f"Audit rows -> base={audit_base.count()}, snapshot={audit_snap.count()}, result={audit_result.count()}")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Snapshot logic for HistoryAHRFeedTable -> final view Hist_AHRFeedTable_History.
table_base = load_accumulation_base("Silver_HistoryAHRFeedTableHistory", f"{GoldLatestPublishedSchema}/HistoryAHRFeedTable")
table_snap = spark.table("AHRFeedTable_TimeStamp")

# Normalise FMCloseDate to string on both sides so filters/unions are type-safe.
table_base = table_base.withColumn("FMCloseDate", F.col("FMCloseDate").cast("string"))
table_snap = table_snap.withColumn("FMCloseDate", F.col("FMCloseDate").cast("string"))

# Surface any schema drift between the accumulated history and the new snapshot.
if set(table_base.columns) != set(table_snap.columns):
    print(f"Table schema drift -> only in base: {set(table_base.columns) - set(table_snap.columns)}; "
          f"only in snapshot: {set(table_snap.columns) - set(table_base.columns)}")

table_has_current = table_base.filter(F.col("FMCloseDate") == F.lit(cur_fmclose)).limit(1).count() > 0

if Variable == 'IstSnapshot':
    if 4 < day_part_value < 10 and not table_has_current:
        table_result = table_base.unionByName(table_snap, allowMissingColumns=True)
        print("Table: appended new snapshot (IstSnapshot).")
    else:
        table_result = table_base
        print("Table: no change (outside 5-9 window or snapshot already exists).")
elif Variable == 'UpdateSnapshot':
    if is_closed_prior_fy and table_has_current:
        # Closed prior-FY snapshot already banked -> immutable; never overwrite (protects e.g. FY26 2026-06-30
        # from being clobbered once the fact has rolled to the next fiscal year).
        table_result = table_base
        print(f"Table: {cur_fmclose} is a closed prior FY already snapshotted -> preserved, no overwrite.")
    else:
        table_result = table_base.filter(F.col("FMCloseDate") != F.lit(cur_fmclose)).unionByName(table_snap, allowMissingColumns=True)
        print("Table: replaced/added current-month snapshot (UpdateSnapshot).")
else:
    table_result = table_base
    print(f"Table: unknown Variable '{Variable}', no change.")

table_result.createOrReplaceTempView("Hist_AHRFeedTable_History")
print(f"Table rows -> base={table_base.count()}, snapshot={table_snap.count()}, result={table_result.count()}")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

writeTable("Hist_AHRFeed_Audit_Test", f"{GoldPublishSchema}/HistoryAHRFeedAudit", WorkspaceId, LakehouseId)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

writeTable("Hist_AHRFeedTable_History", f"{GoldPublishSchema}/HistoryAHRFeedTable", WorkspaceId, LakehouseId)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# Sets the status of the notebook based on the current notebook name, stream, and stage layer.
SetNotebookStatus(NotebookName, StreamName, StageLayer)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }
