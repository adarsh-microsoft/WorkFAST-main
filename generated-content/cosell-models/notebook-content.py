# Fabric notebook source

# METADATA ********************

# META {
# META   "kernel_info": {
# META     "name": "synapse_pyspark"
# META   },
# META   "dependencies": {}
# META }

# MARKDOWN ********************

# ##### Project Name: POSOT 
# ###### Notebook Stage: Gold
# ###### notebook: Reporing_DataTransfer
# ###### Purpose: Notebook to Transfer Data to Reporting workspace
# ###### Parameter Info:
# 
# ###### Revision History:
# 
# | Date     |     Author    |  Description  |  Execution Time  |
# |----------|:-------------:|--------------:|--------------:|
# |Jun 23, 2025|v-pbarad|Created notebook for Reporting_DataTransfer| 4 min|
# |Oct 15, 2025|v-aamahajan|Updated notebook with wheel file approach| 4 min|
# |Apr 13, 2026|v-harshitsi|Added DealPartnerOneMapping table in PS schema| 4 min|
# |May 26, 2026|v-pbarad|Added geography table for Co-Marketing v1.2| 2 min|
# |June 01, 2026|v-pbarad|Added RefreshStatus table for Banner| 2 min|

# CELL ********************

import sempy.fabric as fabric

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

%run CommonUtilityFunctions

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

environment_details = GetWorkspaceIDLakehouseID("Configurations") 
crossdomain_workspace_id = environment_details.get("WorkspaceID") 
crossdomain_lakehouse_id = environment_details.get("LakehouseID") 

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

try:
    install_path = f"abfss://{crossdomain_workspace_id}@msit-onelake.dfs.fabric.microsoft.com/{crossdomain_lakehouse_id}/Files/shortcututility-latest-py3-none-any.whl"
    local_filename = "/tmp/shortcututility-latest-py3-none-any.whl"

    mssparkutils.fs.cp(install_path, f"file:{local_filename}", True)

    !pip install --force-reinstall {local_filename}

except Exception as e:
    raise Exception(f"An error occurred while installing the utility library: {str(e)}")

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

from ShortcutUtility import ShortcutUtility as SHU
shu_obj = SHU.ShortcutUtility(); 

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

#Define the StreamName and Stagelayer
StreamName='CoSell'
StageLayer='Gold'
PublishSchemaName='CoSell_Publish'

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

#Get the notebook status
NotebookName=fabric.resolve_item_name(notebookutils.runtime.context['currentNotebookId'])
Result=GetNotebookStatus(NotebookName, StreamName, StageLayer)
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

StreamName_SalesReporting = "SalesPowerBIReporting"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

lakehouseId_SalesReporting = GetWorkspaceIDLakehouseID(StreamName_SalesReporting)['LakehouseID']
workspaceId_SalesReporting = GetWorkspaceIDLakehouseID(StreamName_SalesReporting)['WorkspaceID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

StreamName_PPRReporting ="PPRReporting"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

lakehouseId_PPRReporting = GetWorkspaceIDLakehouseID(StreamName_PPRReporting)['LakehouseID']
workspaceId_PPRReporting = GetWorkspaceIDLakehouseID(StreamName_PPRReporting)['WorkspaceID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

StreamName_AzureReporting ="AzureReporting"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

lakehouseId_AzureReporting = GetWorkspaceIDLakehouseID(StreamName_AzureReporting)['LakehouseID']
workspaceId_AzureReporting = GetWorkspaceIDLakehouseID(StreamName_AzureReporting)['WorkspaceID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

StreamName_PMReporting ="PartnerMastering_Reporting"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

lakehouseId_PMReporting = GetWorkspaceIDLakehouseID(StreamName_PMReporting)['LakehouseID']
workspaceId_PMReporting = GetWorkspaceIDLakehouseID(StreamName_PMReporting)['WorkspaceID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

StreamName_PartnerProgramsReporting= "PartnerPrograms_Reporting"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

lakehouseId_PartnerProgramsReporting = GetWorkspaceIDLakehouseID(StreamName_PartnerProgramsReporting)['LakehouseID']
workspaceId_PartnerProgramsReporting = GetWorkspaceIDLakehouseID(StreamName_PartnerProgramsReporting)['WorkspaceID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

StreamName_SalesSecurity ="MSSalesUserSecurity"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

lakehouseId_SalesSecurity = GetWorkspaceIDLakehouseID(StreamName_SalesSecurity)['LakehouseID']
workspaceId_SalesSecurity = GetWorkspaceIDLakehouseID(StreamName_SalesSecurity)['WorkspaceID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

StreamName_IAP = "GPSIAPReporting"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

lakehouseId_IAP = GetWorkspaceIDLakehouseID(StreamName_IAP)['LakehouseID']
workspaceId_IAP = GetWorkspaceIDLakehouseID(StreamName_IAP)['WorkspaceID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

#get the WorkspaceId and Lakehouse ID
WorkspaceId_Stream = GetWorkspaceIDLakehouseID(StreamName)['WorkspaceID']
LakehouseId_Stream = GetWorkspaceIDLakehouseID(StreamName)['LakehouseID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

StreamName_Reporting="Cosell_Reporting"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# # #get the WorkspaceId and Lakehouse ID
WorkspaceId_reporting = GetWorkspaceIDLakehouseID(StreamName_Reporting)['WorkspaceID']
LakehouseId_reporting = GetWorkspaceIDLakehouseID(StreamName_Reporting)['LakehouseID']

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

# #get the latest published schema
LatestPublishedSchemaName=GetLatestPublishedSchema(WorkspaceId_Stream,LakehouseId_Stream,StreamName,StageLayer)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

#Create the publish Schema shortcut
CreatePublishShortcutSchema(WorkspaceId_reporting,LakehouseId_reporting,PublishSchemaName)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shortcutDetails_pdm_insights = [
    {
        "SourceType":   "OneLake",
        "ShortcutName": "BusinessSummary", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": workspaceId_SalesSecurity, # Workspace ID of the source OneLake workspace
            "itemId": lakehouseId_SalesSecurity, # Lakehouse ID of the source
            "path": "Tables/MSSalesSecurity/UserBusiness"
        }
    },  
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimMSXProduct", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimMSXProduct"
        }
    },  
     {
        "SourceType":   "OneLake",
        "ShortcutName": "DimATU", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimATU"
        }
    },  
    {
        "SourceType":   "OneLake",
        "ShortcutName": "FactMSXPartnerSharing", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"FactMSXPartnerSharing"
        }
    },  
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimEngagementMilestone", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimEngagementMilestone"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "FactOpportunity", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"FactOpportunity"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "MapOppty", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"MapOppty"
        }
    },
    {
     "SourceType":   "OneLake",
        "ShortcutName": "DimOpportunity", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimOpportunity"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimOpportunityMilestoneEstCompletionDate", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimOpportunityMilestoneEstCompletionDate"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimPartnerDeal", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimPartnerDeal"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimPartnerReportedACR", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
             "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimPartnerReportedACR"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimRevSumDivision", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimRevSumDivision"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimSolution", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimSolution"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimSolutionArea", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimSolutionArea"
        }
    },
    {
        "SourceType":   "OneLake",
        "ShortcutName": "DimSellerCoSellIncentive", # Name of the shortcut
        "ShortcutPath": "Tables/"+PublishSchemaName, # Location where the shortcut needs to be created. E.g., either Tables/<Schema Name> or Files/<Folder Location> based on the requirement
        "OneLake": {
            "workspaceId": WorkspaceId_Stream, # Workspace ID of the source OneLake workspace
            "itemId": LakehouseId_Stream, # Lakehouse ID of the source
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimSellerCoSellIncentive"
        }
    }
    

    ]

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shu_obj.create_shortcuts(WorkspaceId_reporting,LakehouseId_reporting,shortcutDetails_pdm_insights)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shortcutDetails_CoMarketing = [
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimTime",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/DimSalesTime"
        }
    },
*[
    {
        "SourceType": "OneLake",
        "ShortcutName": table,
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + table
        }
    }
    for table in [
        "BudgetProgram",
        "BridgeInvestmentSource",
        "RevenueCategory",
        "ComarketingTPMBudget",
        "DimCustomerCD",
        "DimEngagementMilestoneCD",
        "FactEngagementMilestoneCD",
        "FactIOPO",
        "FactOpportunityCD",
        "FactPartnerDealCD",
        "DimTimeCD",
        "FactSolutionCD",
        "ForecastAmount",
        "FunnelCategory",
        "FunnelCategory2",
        "InvBridgeArea",
        "InvBridgeIndustry",
        "InvBridgeSolutionArea",
        "InvBridgeSolutionPlay",
        "InvestmentAsk",
        "DimIOPO",
        "DimOpportunityCD",
        "Opportunity_MonthlySnapshot",
        "DimPartnerDealCD",
        "DimSharingType",
        "DimSolutionCD",
        "DimSolutionAreaCD",
        "DimSolutionAreaOppty",
        "ReportingPartnerOneCD",
        "BridgeFieldSubsidiary",
        "DimFieldGeography",
        "InvBridgeGCPSArea"

        ]
]
]

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shu_obj.create_shortcuts(WorkspaceId_reporting,LakehouseId_reporting,shortcutDetails_CoMarketing)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shortcutDetails_CoSell_Semantic_Model = [
    {
        "SourceType": "OneLake",
        "ShortcutName": "FactIPT",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_IAP,
            "itemId": lakehouseId_IAP,
            "path": "Tables/GPSIAPReporting/FactIPT"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "CustomPartnerCategory",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/CustomPartnerCategory"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "VWDimGeography",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_PPRReporting,
            "itemId": lakehouseId_PPRReporting,
            "path": "Tables/Gold/DimSalesGeography"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimReportingGeography",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/DimReportingGeography"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimSalesReportingGeography",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/DimSalesReportingGeography"
        }
    },
     {
        "SourceType": "OneLake",
        "ShortcutName": "FactPartnerSpecialization",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_PartnerProgramsReporting,
            "itemId": lakehouseId_PartnerProgramsReporting,
            "path": "Tables/ASP/FactPartnerSpecialization"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimCRMPartnerAccount",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/CoSellGold_Int/DimCRMPartnerAccount"
        }
    },
     {
        "SourceType": "OneLake",
        "ShortcutName": "MapUserSubsidiary",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"DimUserSubsidiary"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimMSXCustomer",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/DimCustomer_FY26"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimReportingPartnerOneSub",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/DimReportingPartnerOneSub_FY26"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "BridgeGeography",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/BridgeGeography"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "CustomPartnerReportingGeography",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/CustomPartnerReportingGeography"
        }
    },

*[
    {
        "SourceType": "OneLake",
        "ShortcutName": table,
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + table
        }
    }
    for table in [
        "Bridge_CascadedPartnerOne",
        "CustomerSecurity",
        "DimAccountTagsReporting",
        "DimCapacityGeography",
        "DimCustomerGeography",
        "DimCustomerSegment",
        "DimCustomgtmReadiness",
        "DimGPSBusinessUnit",
        "DimGPSCRMAccount",
        "DimIndustry",
        "DimISVConnectApp",
        "DimLead",
        "DimMarketplaceInvoice",
        "DimMarketplaceOffer",
        "DimMarketPlacePublisher",
        "DimMSXSolutionArea",
        "DimMSXWinsWithSolutionAttach",
        "DimMSXWorkLoad",
        "DimPartnerDealDuration",
        "DimPartnerDealProfile",
        "DimPartnerDealSolutionAttached",
        "DimPartnerDealSolutionHistory",
        "DimPartnerOne",
        "DimPartnerSharingMetricType",
        "DimPINMetric",
        "DimPlanProfile",
        "DimPrioritizedAndReadyPartnersConsumptionOpportunity",
        "DimPrioritizedAndReadyPartnersOppty",
        "DimReportingPartnerOneMedian",
        "DimSalesProgram",
        "DimScoreCardRecognitionTime",
        "DimSellInCountry",
        "DimServiceCompGrouping",
        "DimSolutionEngagementPipeline",
        "DimTopTierMonthlyStatus",
        "FactAccount",
        "FactAccountPIN",
        "FactCoSellTargets",
        "FactCRMPartner",
        "FactCSPSolutionBilledOpportunity",
        "FactCSPSolutionConsumptionOpportunity",
        "FactCSPSolutionPartnerDeal",
        "FactEngagementMilestonePipeline",
        "FactFY20AllianceReadiness",
        "FactISVConnect",
        "FactLead",
        "MapEngagementMilestone",
        "FactMarketplaceBilledSales",
        "FactMBSCommercialTargets",
        "FactMBSTargets",
        "FactPartnerDeal",
        "FactPartnerDeal_FY20",
        "FactPartnerDeal_FY21",
        "FactPartnerDeal_FY22",
        "FactPartnerDeal_FY23",
        "FactPartnerDeal_FY24",
        "FactPartnerDeal_FY25",
        "FactPartnerDealDuration",
        "FactPartnerOne",
        "FactPRACRTargets",
        "FactSolution",
        "FactSolutionBilledOpportunity",
        "FactSolutionCapacityGeography",
        "FactSolutionConsumptionOpportunity",
        "FactSolutionPartnerDeal",
        "MapSolutionPracticeIndustryCountry",
        "MapAccountSolution",
        "MapAccountTag",
        "MapCustomPartnerSegment",
        "MapIndustrySolution",
        "MapOfferPartnerDeal",
        "MapOpportunitySalesProgram",
        "MapOpportunitySolution",
        "MapOpptyPartnerAttachAndSolutionAttach",
        "MapPartnerDeal",
        "MapPartnerDealPartnerAttachAndSolutionAttach",
        "MapPartnerOneAccountTag",
        "MapPartnerOpportunity",
        "MapPrioritizedDealSharingAndWins",
        "MapPrioritizedOppty",
        "MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "MapSolutionPracticeIndustryCountry_Capacity",
        "MapSolutionSellerCoSellIncentive_Capacity",
        "MapSolutionSellInCountry",
        "MapSolutionSolutionAreaIndustryCapacity",
        "PartnerSecurity",
        "SnapshotMapSolutionPriorityScenarioIndustryCountry",
        "DimPartnerSharingFlags",
        "DimPartnerMAICPPStatus",
        "DimCustomOpptyStatus",
        "DimUserSubsidiary",
        "FactAzureConsumptionCTCG",
        "FactAzureConsumptionP1CGCT",
        "ProjectedBaselineCTCG",
        "ProjectedBaselineP1CGCT",
        "SnapshotDimOpportunityWeekly",
        "SnapshotPartnerSharingWeekly",
        "PDM_PDMM_HierarchyReporting",
        "DimAccountGeographyHierarchyReporting",
        "DimFiscalMonthReporting",
        "DimMSXPartnerSharingCategorizationReporting",
        "DimPartnerReferralReporting",
        "DimSegmentHierarchyReporting",
        "FactPipelineCurrent",
        "SecAccountProductMapReporting",
        "SecDistinctSubsidiaryReporting",
        "SecUserSubsidiaryReporting",
        "DimPartnerDealApprovalReportedDate",
        "PartnerDealPartnerReportedACR",
        "DimPartnerDesignation",
        "DimCosellServices",
        "OpportunityFlags",
        "DimMetric",
        "RefreshStatus"        
    ]
]
]


# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shu_obj.create_shortcuts(WorkspaceId_reporting,LakehouseId_reporting,shortcutDetails_CoSell_Semantic_Model)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

PublishSchemaName="PartnerSharing_Publish"

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

#pmx
shortcutdetails = [
{
        "SourceType": "OneLake",
        "ShortcutName": "BusinessHierarchyReporting",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"BusinessHierarchyReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SnapshotFactMSXCombined",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"SnapshotFactMSXCombined"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "ACRPipeline",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/"+LatestPublishedSchemaName+"/"+"ACRPipeline"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "CustomPartnerCategory",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/"+"CustomPartnerCategory"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "BridgeOpportunity",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" +"BridgeOpportunity"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "CustomSolutionAreaReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "CustomSolutionAreaReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DatasetRefresh",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DatasetRefresh"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimAreaFlags",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/" + "DimAreaFlags"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimATU",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimATU"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimCapacityGeography",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimCapacityGeography"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimCRMPartnerAccountReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimCRMPartnerAccountReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimCustomerGeography",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimCustomerGeography"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimCustomerReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimCustomerReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimCustomerSegment",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimCustomerSegment"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimOpportunityMilestoneEstCompletionDate",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimOpportunityMilestoneEstCompletionDate"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimOpportunityReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimOpportunityReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimPartnerOne",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimPartnerOne"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimPartnerReferralReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimPartnerReferralReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimReportingPartnerOneSub",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimReportingPartnerOneSub"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimSolution",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimSolution"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimSolutionArea",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimSolutionArea"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimTime",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/DimSalesTime"
        }
    },
{
        "SourceType": "OneLake",
        "ShortcutName": "DimUserSubsidiary",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimUserSubsidiary"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "FactMSXCombined",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "FactMSXCombined"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "FactPartnerReferralReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "FactPartnerReferralReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "MapPartnerSolutionAreaReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "MapPartnerSolutionAreaReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "MapReportingPartnerOne",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "MapReportingPartnerOne"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "PDM_PDMM_HierarchyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "PDM_PDMM_HierarchyReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "ReportingPartnerOne",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_PMReporting,
            "itemId": lakehouseId_PMReporting,
            "path": "Tables/PartnerMastering/ReportingPartnerOne"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "ReportingPartnerOneSubReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "ReportingPartnerOneSubReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SolutionArea_OpptyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SolutionArea_OpptyReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimFiscalMonthReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimFiscalMonthReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimAccountTagsReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimAccountTagsReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "CustomCreatedDateReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "CustomCreatedDateReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimSalesPlayReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimSalesPlayReporting"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "CustomStatusReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "CustomStatusReporting"
        }

},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimCustomPartnerDealDirectionReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimCustomPartnerDealDirectionReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimAccountGeographyHierarchyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimAccountGeographyHierarchyReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimSegmentHierarchyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimSegmentHierarchyReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimSalesProgramReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimSalesProgramReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimProductReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimProductReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimPrioritizedPartnerReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimPrioritizedPartnerReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimEngagementMilestoneReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimEngagementMilestoneReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimProductHierarchyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimProductHierarchyReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimMSXPartnerSharingCategorizationReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimMSXPartnerSharingCategorizationReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "CustomPartnerSegment",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "CustomPartnerSegment"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimPricingLevelHierarchyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimPricingLevelHierarchyReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimRevSumHierarchyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimRevSumHierarchyReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "CustomDueDateReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "CustomDueDateReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimSolutionAreaDetailReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimSolutionAreaDetailReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimSolutionAreaReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimSolutionAreaReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DimWorkloadReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DimWorkloadReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecSellerAccountProductMapReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecSellerAccountProductMapReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "PartnerAsEndCustomerReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "PartnerAsEndCustomerReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecDimSellerReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecDimSellerReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecDistinctSubsidiaryReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecDistinctSubsidiaryReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecUPNOpportunityTeamReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecUPNOpportunityTeamReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecSellerHierarchyReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecSellerHierarchyReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecAccountProductMapReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecAccountProductMapReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecUPNDimSellerReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecUPNDimSellerReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecOpportunityTeamReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecOpportunityTeamReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecUPNAccountTeamReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecUPNAccountTeamReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecUserSubsidiaryReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecUserSubsidiaryReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecUPNUserSubsidiaryReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecUPNUserSubsidiaryReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "SecAccountTeamReporting",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "SecAccountTeamReporting"
        }
        
},
{
        "SourceType": "OneLake",
        "ShortcutName": "DealPartnerOneMapping",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "DealPartnerOneMapping"
        }
},
{
        "SourceType": "OneLake",
        "ShortcutName": "RefreshStatus",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + "RefreshStatus"
        }
}


]

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shu_obj.create_shortcuts(WorkspaceId_reporting,LakehouseId_reporting,shortcutdetails)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

PublishSchemaName='PSA_Publish'

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shortcutDetails_PSA = [
   
    {
        "SourceType": "OneLake",
        "ShortcutName": "FactAzureConsumption",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/FactAzureConsumption"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimAzureServiceLevelWorkload",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_PPRReporting,
            "itemId": lakehouseId_PPRReporting,
            "path": "Tables/Gold/DimAzureServiceLevelWorkload"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimAzureStrategicPillar",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_PPRReporting,
            "itemId": lakehouseId_PPRReporting,
            "path": "Tables/Gold/DimAzureStrategicPillar"
        }
    },

     {
        "SourceType": "OneLake",
        "ShortcutName": "BridgeAzureAssociationPartner",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_AzureReporting,
            "itemId": lakehouseId_AzureReporting,
            "path": "Tables/Gold/BridgeAzureAssociationPartner"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimAZPricingLevel",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_PPRReporting,
            "itemId": lakehouseId_PPRReporting,
            "path": "Tables/Gold/DimAZPricingLevel"
        }
    },
   
    {
        "SourceType": "OneLake",
        "ShortcutName": "MapAzureAssociationPartner",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": workspaceId_AzureReporting,
            "itemId": lakehouseId_AzureReporting,
            "path": "Tables/Gold/MapAzureAssociationPartner"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "DimOrganizationSubSegment",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/DimOrganizationSubSegment"
        }
    },
     {
        "SourceType": "OneLake",
        "ShortcutName": "DimTime",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/DimSalesTime"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "Dir_PartnerAccount",
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/Silver/Dir_PartnerAccount"
        }
    },
     {
        "SourceType": "OneLake",
        "ShortcutName": "CustomPartnerReportingGeography",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/CustomPartnerReportingGeography"
        }
    },
    {
        "SourceType": "OneLake",
        "ShortcutName": "BridgeGeography",
        "ShortcutPath": "Tables/"+PublishSchemaName,
        "OneLake": {
            "WorkspaceId": workspaceId_SalesReporting,
            "itemId": lakehouseId_SalesReporting,
            "path": f"Tables/Gold/BridgeGeography"
        }
    },    

*[
    {
        "SourceType": "OneLake",
        "ShortcutName": table,
        "ShortcutPath": "Tables/" + PublishSchemaName,
        "OneLake": {
            "workspaceId": WorkspaceId_Stream,
            "itemId": LakehouseId_Stream,
            "path": "Tables/" + LatestPublishedSchemaName + "/" + table
        }
    }
    for table in [
    "CustomPartnerCategory",
    "PartnerSpecialization",
    "DimProjectTask",
    "DimProjectDeliverables",
    "DimProject",
    "SolutionPartnerDesignation",
    "PSAList",
    "FactAzureConsumptionP1",
    "PSA_Table",
    "DimCreditingGeography",
    "LatestRefresh_PSA",
    "FactPartnerReferralReporting",
    "ActiveSubRegionFlag",
    "SecOpportunityTeamReporting",
    "SolutionArea_OpptyReporting",
    "SolutionAreaMapping",
     "MapReportingPartnerOne",
    "DimCustomPartnerDealDirectionReporting",
    "CustomPartnerSegment",
    "DimLead",
    "DimEngagementMilestoneReporting",
    "FactMSXCombined",
    "DimUserSubsidiary",
    "DimOpportunityReporting",
    "DimOpportunityMilestoneEstCompletionDate",
    "DimPartnerReferralReporting",
    "ReportingPartnerOneSubReporting",
    "DimSolution",
    "DimSolutionArea",
    "RefreshStatus"
        ]
]
]

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

shu_obj.create_shortcuts(WorkspaceId_reporting,LakehouseId_reporting,shortcutDetails_PSA)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }

# CELL ********************

SetNotebookStatus(NotebookName,StreamName,StageLayer)

# METADATA ********************

# META {
# META   "language": "python",
# META   "language_group": "synapse_pyspark"
# META }
