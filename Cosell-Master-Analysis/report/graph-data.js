window.GRAPHS = {
  "notebook": {
    "nodes": [
      {
        "id": "Cosell_Gold_DimRevSumDivision",
        "label": "DimRevSumDivision",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/BuildWithEngagement",
        "label": "BuildWithEngagement",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactOpportunitiesSalesCycleDuration",
        "label": "FactOpportunitiesSalesCycleDuration",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "FactMSXCombined",
        "label": "FactMSXCombined",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Silver_PartnerMaster",
        "label": "Cosell_Silver_PartnerMaster",
        "type": "producer",
        "layer": "Bronze",
        "kind": "Other"
      },
      {
        "id": "src:Gold/goldint_FactEngagementMilestone",
        "label": "goldint_FactEngagementMilestone",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_TrueACRPartnerDeal_int",
        "label": "TrueACRPartnerDeal_int",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_DimPINMetric",
        "label": "DimPINMetric",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactCRMPartner",
        "label": "FactCRMPartner",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Silver_factpartnerdeal_snapshot",
        "label": "Cosell_Silver_factpartnerdeal_snapshot",
        "type": "producer",
        "layer": "Silver",
        "kind": "Fact"
      },
      {
        "id": "src:Silver/DimSalesGeography",
        "label": "DimSalesGeography",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactPartnerOne",
        "label": "FactPartnerOne",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Silver_Actual",
        "label": "Cosell_Silver_Actual",
        "type": "producer",
        "layer": "Silver",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_DimEngagementMilestone",
        "label": "DimEngagementMilestone",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/DimAccountGeographyHierarchy",
        "label": "DimAccountGeographyHierarchy",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_MapSolutionPartnerDeal",
        "label": "MapSolutionPartnerDeal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "src:Silver/PartnerMarketingProfilePII",
        "label": "PartnerMarketingProfilePII",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimSolutionArea",
        "label": "DimSolutionArea",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimCustomerSegment",
        "label": "DimCustomerSegment",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/Hub_vw_Account",
        "label": "Hub_vw_Account",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_PS_DimPartnerDeal",
        "label": "PS_DimPartnerDeal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimScoreCardRecognitionTime",
        "label": "DimScoreCardRecognitionTime",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimOpportunity",
        "label": "DimOpportunity",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimSalesPlayReporting",
        "label": "DimSalesPlayReporting",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Gold/DimChannelManager",
        "label": "DimChannelManager",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Gold/DimHC360Personnel",
        "label": "DimHC360Personnel",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_PipelineFactCurrent",
        "label": "PipelineFactCurrent",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactEngagementMilestonePipeline",
        "label": "FactEngagementMilestonePipeline",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "PASS",
        "findings": 0
      },
      {
        "id": "src:Gold/PartnerDealIntermediate",
        "label": "PartnerDealIntermediate",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_MapPartnerOneAccountTag",
        "label": "MapPartnerOneAccountTag",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "Cosell_Silver_DimReportingGeography",
        "label": "Cosell_Silver_DimReportingGeography",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactRecruitISVTargets",
        "label": "FactRecruitISVTargets",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "src:Gold/DimEngagement",
        "label": "DimEngagement",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimPartnerReferralReporting",
        "label": "DimPartnerReferralReporting",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimProduct",
        "label": "DimProduct",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Silver_SellInCountryMapping",
        "label": "Cosell_Silver_SellInCountryMapping",
        "type": "producer",
        "layer": "Silver",
        "kind": "Map"
      },
      {
        "id": "Cosell_Gold_DimIPPartner",
        "label": "DimIPPartner",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_dimmarketplaceoffer",
        "label": "dimmarketplaceoffer",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal_FY20",
        "label": "FactPartnerDeal_FY20",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 3
      },
      {
        "id": "Cosell_Gold_GeographySubsidiaryHierarchyDim",
        "label": "GeographySubsidiaryHierarchyDim",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/OcpCampaign",
        "label": "OcpCampaign",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactSolution",
        "label": "FactSolution",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_MapSolutionPracticeIndustryCountry",
        "label": "MapSolutionPracticeIndustryCountry",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "Cosell_Gold_FactSolutionBilledOpportunity",
        "label": "FactSolutionBilledOpportunity",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactLead",
        "label": "FactLead",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_ReferralCycleTimeUnpivoted",
        "label": "ReferralCycleTimeUnpivoted",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "src:Gold/DimProjectDeliverables",
        "label": "DimProjectDeliverables",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Gold/dimpartnersharingexclusion_billedpipeline",
        "label": "dimpartnersharingexclusion_billedpipeline",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Gold/DimGPSBusinessUnit",
        "label": "DimGPSBusinessUnit",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_CustomerHQAccountsDim",
        "label": "CustomerHQAccountsDim",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactCRMUser",
        "label": "FactCRMUser",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_DimISVConnectApp",
        "label": "DimISVConnectApp",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimSharingType",
        "label": "DimSharingType",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactSolutionPartnerDeal",
        "label": "FactSolutionPartnerDeal",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_DimRecruitLead",
        "label": "DimRecruitLead",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/DimAllAccounts",
        "label": "DimAllAccounts",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal_FY23",
        "label": "FactPartnerDeal_FY23",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_FactAHRFeedAudit",
        "label": "FactAHRFeedAudit",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "src:Silver/DimCustomSellerManagerWorkloadsMaster",
        "label": "DimCustomSellerManagerWorkloadsMaster",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/GL04GeographyHierarchy",
        "label": "GL04GeographyHierarchy",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "label": "FactEngagementMilestonePipeline_int",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_OpportunityDraftIntermediate",
        "label": "OpportunityDraftIntermediate",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal_FY21",
        "label": "FactPartnerDeal_FY21",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal_FY24",
        "label": "FactPartnerDeal_FY24",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_HC360PersonnelFact",
        "label": "HC360PersonnelFact",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "NIT",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_DimOpportunityReporting",
        "label": "DimOpportunityReporting",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Silver_DimReportedSubsegmentHierarchy",
        "label": "Cosell_Silver_DimReportedSubsegmentHierarchy",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/DimAccountGeographyHierarchy_RoB",
        "label": "DimAccountGeographyHierarchy_RoB",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_MapSolutionEngagement",
        "label": "MapSolutionEngagement",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "Cosell_Gold_DimCRMPartnerAccount",
        "label": "DimCRMPartnerAccount",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_dimtoptiermonthlystatus",
        "label": "dimtoptiermonthlystatus",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/DimCustomGeography",
        "label": "DimCustomGeography",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimProductPFam",
        "label": "DimProductPFam",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactSolutionCapacityGeography",
        "label": "FactSolutionCapacityGeography",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 3
      },
      {
        "id": "Cosell_Gold_FinalInvoiceAmount",
        "label": "FinalInvoiceAmount",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_FactLessSolutionEngagement",
        "label": "FactLessSolutionEngagement",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 1
      },
      {
        "id": "Cosell_Silver_SolutionArea",
        "label": "Cosell_Silver_SolutionArea",
        "type": "producer",
        "layer": "Silver",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_PSCDeal_Internal",
        "label": "PSCDeal_Internal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_DimPartnerDeal",
        "label": "DimPartnerDeal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactMBSCommercialTargetsExcel",
        "label": "FactMBSCommercialTargetsExcel",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "src:Silver/FieldGeographyDefinition",
        "label": "FieldGeographyDefinition",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/Bridge_CascadedPartnerOne",
        "label": "Bridge_CascadedPartnerOne",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimSolutionEngagementPipeline",
        "label": "DimSolutionEngagementPipeline",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/PRACRTargetsData_FY22",
        "label": "PRACRTargetsData_FY22",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimSolution",
        "label": "DimSolution",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactIPCoSell",
        "label": "FactIPCoSell",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "src:Silver/Map_Association_Partner_PPR",
        "label": "Map_Association_Partner_PPR",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
        "label": "FactCSPSolutionBilledOpportunity",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactCosellTargets",
        "label": "FactCosellTargets",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal",
        "label": "FactPartnerDeal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_DimPartnerdeal_int",
        "label": "DimPartnerdeal_int",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimSolutionAreaOppty",
        "label": "DimSolutionAreaOppty",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/DimCustomTime",
        "label": "DimCustomTime",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal_int",
        "label": "FactPartnerDeal_int",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactInvoice",
        "label": "FactInvoice",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "NIT",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactOpportunity_int",
        "label": "FactOpportunity_int",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 3
      },
      {
        "id": "src:Silver/GL04CostCenter",
        "label": "GL04CostCenter",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/PartnerDealFY25_Snapshot",
        "label": "PartnerDealFY25_Snapshot",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Silver/HC01HCActualSummary",
        "label": "HC01HCActualSummary",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimFirstDatePartition",
        "label": "DimFirstDatePartition",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimIPCosell",
        "label": "DimIPCosell",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Gold/PartnerDealSolutionNameBasedMapping",
        "label": "PartnerDealSolutionNameBasedMapping",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Silver/Currency",
        "label": "Currency",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Silver_FactPipeline",
        "label": "Cosell_Silver_FactPipeline",
        "type": "producer",
        "layer": "Silver",
        "kind": "Fact"
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal_FY25",
        "label": "FactPartnerDeal_FY25",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "src:Gold/FactMSXPartnerSharing_Consumption",
        "label": "FactMSXPartnerSharing_Consumption",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Silver_Account",
        "label": "Cosell_Silver_Account",
        "type": "producer",
        "layer": "Silver",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_DimChannelPartner",
        "label": "DimChannelPartner",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/GL04ProfitCenter",
        "label": "GL04ProfitCenter",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/FactISV",
        "label": "FactISV",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimSalesCustomer",
        "label": "DimSalesCustomer",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactOpportunityProduct_Internal",
        "label": "FactOpportunityProduct_Internal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "NIT",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_FinalActualAmount",
        "label": "FinalActualAmount",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_FactISVConnect",
        "label": "FactISVConnect",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "src:Gold/PartnerDealFY24_Snapshot",
        "label": "PartnerDealFY24_Snapshot",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_dimcustomergeography",
        "label": "dimcustomergeography",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/OcpTechServiceRequest",
        "label": "OcpTechServiceRequest",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/FactPipelineCurrent",
        "label": "FactPipelineCurrent",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Silver/ManagedPractice_Full",
        "label": "ManagedPractice_Full",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_PartnerDealFact",
        "label": "PartnerDealFact",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 3
      },
      {
        "id": "src:Gold/DimEngagementTagsHidden",
        "label": "DimEngagementTagsHidden",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimCustomFieldSolutionAreaMapping",
        "label": "DimCustomFieldSolutionAreaMapping",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/PartnerDealFY23_Snapshot",
        "label": "PartnerDealFY23_Snapshot",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_PCDeal_Internal",
        "label": "PCDeal_Internal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "src:Silver/DimManagedTPAccount",
        "label": "DimManagedTPAccount",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactCSPSolutionConsumptionOpportunity",
        "label": "FactCSPSolutionConsumptionOpportunity",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_CSPSolutionInternal",
        "label": "CSPSolutionInternal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "src:Gold/DimProjectTask",
        "label": "DimProjectTask",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactEngagementMilestone",
        "label": "FactEngagementMilestone",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_PipelinePartnerMaster",
        "label": "PipelinePartnerMaster",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_DimLifecycleStage",
        "label": "DimLifecycleStage",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "label": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "Cosell_Gold_FactEngagementMilestoneReporting",
        "label": "FactEngagementMilestoneReporting",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_FactSolutionConsumptionOpportunity",
        "label": "FactSolutionConsumptionOpportunity",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_FactIOPO",
        "label": "FactIOPO",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_Associated_DimPartnerReferral",
        "label": "Associated_DimPartnerReferral",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "DimCustomPartnerDealDirectionReporting",
        "label": "DimCustomPartnerDealDirectionReporting",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimMSXSolutionArea",
        "label": "DimMSXSolutionArea",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "CoSell_Gold_FactMBSCommercialTargets",
        "label": "FactMBSCommercialTargets",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 2
      },
      {
        "id": "src:Silver/Project",
        "label": "Project",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/FactSalesStageVelocity",
        "label": "FactSalesStageVelocity",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "PSA_Gold_FactAzureConsumptionP1",
        "label": "PSA_Gold_FactAzureConsumptionP1",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_MapSolutionPractice",
        "label": "MapSolutionPractice",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "src:Silver/ReportingPartnerOne",
        "label": "ReportingPartnerOne",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactCSPSolutionPartnerDeal",
        "label": "FactCSPSolutionPartnerDeal",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactMBSTargets",
        "label": "FactMBSTargets",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "HIGH",
        "findings": 2
      },
      {
        "id": "TPP_Silver_DimPartnerAccount",
        "label": "TPP_Silver_DimPartnerAccount",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactMSXPartnerSharing",
        "label": "FactMSXPartnerSharing",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_DimPartner",
        "label": "DimPartner",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_MarketplaceDealsACV_Snapshot",
        "label": "MarketplaceDealsACV_Snapshot",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "src:Silver/MapAzureAssociationPartner",
        "label": "MapAzureAssociationPartner",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimSolutionAreaDetailReporting",
        "label": "DimSolutionAreaDetailReporting",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_MapAccountTag",
        "label": "MapAccountTag",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "Cosell_Gold_MapOpportunitySolution",
        "label": "MapOpportunitySolution",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "src:Silver/PartnerImpactNumber",
        "label": "PartnerImpactNumber",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimSalesGroup",
        "label": "DimSalesGroup",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/Opportunity_Internal",
        "label": "Opportunity_Internal",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactAzureConsumptionP1CGCT",
        "label": "FactAzureConsumptionP1CGCT",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "src:Silver/DimAzureAssociationType",
        "label": "DimAzureAssociationType",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/factmsxpartnersharing_stage1",
        "label": "factmsxpartnersharing_stage1",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_Solution_Internal",
        "label": "Solution_Internal",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "src:Silver/DimACRAdjustmentType",
        "label": "DimACRAdjustmentType",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/factmsxpartnersharing_stage3",
        "label": "factmsxpartnersharing_stage3",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimAssociationType",
        "label": "DimAssociationType",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimFiscalMonth",
        "label": "DimFiscalMonth",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/FactMSXPartnerSharing_Billed",
        "label": "FactMSXPartnerSharing_Billed",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimSellercosellIncentive",
        "label": "DimSellercosellIncentive",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactOpportunity",
        "label": "FactOpportunity",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_TPAccountsDim",
        "label": "TPAccountsDim",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactIPCoSellTransition",
        "label": "FactIPCoSellTransition",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "NIT",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_DimIndustry",
        "label": "DimIndustry",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Gold/DimMSXCustomer",
        "label": "DimMSXCustomer",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactOpportunityProduct",
        "label": "FactOpportunityProduct",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactAzureConsumptionCTCG",
        "label": "FactAzureConsumptionCTCG",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "src:Gold/PartnerDealFY22_Snapshot",
        "label": "PartnerDealFY22_Snapshot",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimReportingPartnerOneSub",
        "label": "DimReportingPartnerOneSub",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactAccount",
        "label": "FactAccount",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "src:Silver/vw_certifications",
        "label": "vw_certifications",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimWorkload",
        "label": "DimWorkload",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactFY20AllianceReadiness",
        "label": "FactFY20AllianceReadiness",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_FactPartnerReferralReporting",
        "label": "FactPartnerReferralReporting",
        "type": "producer",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_FactPartnerDeal_FY22",
        "label": "FactPartnerDeal_FY22",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "src:Silver/VWDimGeography",
        "label": "VWDimGeography",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimPartnerDealSolutionHistory",
        "label": "DimPartnerDealSolutionHistory",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_DimInvoice",
        "label": "DimInvoice",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_SellerCoSellIncentiveSolution",
        "label": "SellerCoSellIncentiveSolution",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "src:Silver/FactMarketplaceInvoice",
        "label": "FactMarketplaceInvoice",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimSalesGeoHierarchy",
        "label": "DimSalesGeoHierarchy",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimTime",
        "label": "DimTime",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "src:Gold/PartnerDealFY20_Snapshot",
        "label": "PartnerDealFY20_Snapshot",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimLead",
        "label": "DimLead",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/DimFieldGeography",
        "label": "DimFieldGeography",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactPartnerDealDuration",
        "label": "FactPartnerDealDuration",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "PASS",
        "findings": 0
      },
      {
        "id": "Cosell_Gold_DimOpportunity_Int",
        "label": "DimOpportunity_Int",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Silver_DimProductHierarchy",
        "label": "Cosell_Silver_DimProductHierarchy",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Silver_DimRevenueAccount",
        "label": "Cosell_Silver_DimRevenueAccount",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Silver_SolutionIndustryAssociation",
        "label": "Cosell_Silver_SolutionIndustryAssociation",
        "type": "producer",
        "layer": "Silver",
        "kind": "Other"
      },
      {
        "id": "Cosell_Gold_FactPRACRTargets",
        "label": "FactPRACRTargets",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "PASS",
        "findings": 0
      },
      {
        "id": "src:Silver/DimRevSumHierarchy",
        "label": "DimRevSumHierarchy",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/DimSegmentHierarchy",
        "label": "DimSegmentHierarchy",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Silver/vw_alliancereadiness",
        "label": "vw_alliancereadiness",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimGPSCRMAccount",
        "label": "DimGPSCRMAccount",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactMarketPlaceOffer",
        "label": "FactMarketPlaceOffer",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "NIT",
        "findings": 2
      },
      {
        "id": "src:Silver/DimSalesDate",
        "label": "DimSalesDate",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "src:Gold/factmsxpartnersharing_stage2",
        "label": "factmsxpartnersharing_stage2",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimCapacityGeography",
        "label": "DimCapacityGeography",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Gold_FactOpportunityReporting",
        "label": "FactOpportunityReporting",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 1
      },
      {
        "id": "Cosell_Gold_MapIndustrysolution",
        "label": "MapIndustrysolution",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "src:Gold/DimManagerList",
        "label": "DimManagerList",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactMarketplaceBilledSales",
        "label": "FactMarketplaceBilledSales",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "WARN",
        "findings": 2
      },
      {
        "id": "Cosell_Gold_PartnerDealSolution_Snapshot",
        "label": "PartnerDealSolution_Snapshot",
        "type": "producer",
        "layer": "Gold",
        "kind": "Other"
      },
      {
        "id": "src:Silver/PRACRTargetsData",
        "label": "PRACRTargetsData",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimIPCoSell_D365",
        "label": "DimIPCoSell_D365",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/Hub_vw_Currency",
        "label": "Hub_vw_Currency",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_MapPartnerDealSolutionNameBasedMapping",
        "label": "MapPartnerDealSolutionNameBasedMapping",
        "type": "producer",
        "layer": "Gold",
        "kind": "Map"
      },
      {
        "id": "Cosell_Gold_DimPartnerDealProfile",
        "label": "DimPartnerDealProfile",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/DimPerson",
        "label": "DimPerson",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimMSXWorkload",
        "label": "DimMSXWorkload",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/FactSubScorecardTargets",
        "label": "FactSubScorecardTargets",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimEngagementMilestoneReporting",
        "label": "DimEngagementMilestoneReporting",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "src:Silver/FactAzureConsumption",
        "label": "FactAzureConsumption",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "CoSell_Gold_FactProject",
        "label": "FactProject",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "PASS",
        "findings": 0
      },
      {
        "id": "src:Silver/DimOrganizationSubSegment",
        "label": "DimOrganizationSubSegment",
        "type": "source",
        "layer": "Silver",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_FactAccountPin",
        "label": "FactAccountPin",
        "type": "fact",
        "layer": "Gold",
        "kind": "Fact",
        "verdict": "PASS",
        "findings": 0
      },
      {
        "id": "src:Gold/PartnerDealFY21_Snapshot",
        "label": "PartnerDealFY21_Snapshot",
        "type": "source",
        "layer": "Gold",
        "kind": "Source"
      },
      {
        "id": "Cosell_Gold_DimPartnerOne",
        "label": "DimPartnerOne",
        "type": "producer",
        "layer": "Gold",
        "kind": "Dimension"
      },
      {
        "id": "Cosell_Silver_DimPricingLevelHierarchy",
        "label": "Cosell_Silver_DimPricingLevelHierarchy",
        "type": "producer",
        "layer": "Silver",
        "kind": "Dimension"
      }
    ],
    "edges": [
      {
        "from": "src:Silver/FactMarketplaceInvoice",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "FactMarketplaceInvoice"
      },
      {
        "from": "Cosell_Gold_DimInvoice",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimInvoice"
      },
      {
        "from": "Cosell_Gold_dimmarketplaceoffer",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimMarketplaceOffer"
      },
      {
        "from": "src:Gold/DimMSXCustomer",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimMSXCustomer"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_CustomerHQAccountsDim",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "CustomerHQAccountsDim_int"
      },
      {
        "from": "Cosell_Silver_DimRevenueAccount",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimRevenueAccount"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestone",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimEngagementMilestone_int"
      },
      {
        "from": "Cosell_Gold_DimReportingPartnerOneSub",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimReportingPartnerOneSub"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Silver_PartnerMaster",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Bronze",
        "table": "PartnerMaster"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "src:Silver/VWDimGeography",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "VWDimGeography"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "src:Silver/DimCustomTime",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimCustomTime"
      },
      {
        "from": "src:Silver/DimFirstDatePartition",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimFirstDatePartition"
      },
      {
        "from": "src:Silver/DimOrganizationSubSegment",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimOrganizationSubSegment"
      },
      {
        "from": "src:Silver/FieldGeographyDefinition",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "FieldGeographyDefinition"
      },
      {
        "from": "src:Silver/DimFieldGeography",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimFieldGeography"
      },
      {
        "from": "src:Silver/DimAccountGeographyHierarchy_RoB",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimAccountGeographyHierarchy_RoB"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "src:Silver/DimCustomGeography",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimCustomGeography"
      },
      {
        "from": "Cosell_Gold_FactMarketplaceBilledSales",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Gold",
        "table": "FactMarketplaceBilledSales"
      },
      {
        "from": "src:Silver/DimFirstDatePartition",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimFirstDatePartition"
      },
      {
        "from": "src:Silver/DimSalesCustomer",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimSalesCustomer"
      },
      {
        "from": "src:Silver/DimSalesGroup",
        "to": "Cosell_Gold_FactMarketplaceBilledSales",
        "layer": "Silver",
        "table": "DimSalesGroup"
      },
      {
        "from": "src:Silver/PartnerImpactNumber",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Silver",
        "table": "PartnerImpactNumber"
      },
      {
        "from": "src:Silver/DimSalesGeography",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Silver",
        "table": "DimSalesGeography"
      },
      {
        "from": "src:Silver/ManagedPractice_Full",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Silver",
        "table": "ManagedPractice_Full"
      },
      {
        "from": "Cosell_Gold_DimPartnerOne",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Gold",
        "table": "DimPartnerOne"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Gold_DimGPSCRMAccount",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Gold",
        "table": "DimGPSCRMAccount"
      },
      {
        "from": "Cosell_Gold_DimPINMetric",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Gold",
        "table": "DimPINMetric"
      },
      {
        "from": "src:Gold/DimGPSBusinessUnit",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Gold",
        "table": "DimGPSBusinessUnit"
      },
      {
        "from": "Cosell_Gold_MapAccountTag",
        "to": "Cosell_Gold_FactAccountPin",
        "layer": "Gold",
        "table": "MapAccountTag"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimSellercosellIncentive",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "DimSellerCoSellIncentive"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "MapSolutionPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimPartnerDealSolutionHistory",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "DimPartnerDealSolutionHistory"
      },
      {
        "from": "Cosell_Gold_DimIPPartner",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "DimIPPartner"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/PartnerDealFY22_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal_FY22",
        "layer": "Gold",
        "table": "PartnerDealFY22_Snapshot"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "src:Gold/DimMSXCustomer",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Gold",
        "table": "DimMSXCustomer"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Silver_PartnerMaster",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Bronze",
        "table": "PartnerMaster"
      },
      {
        "from": "src:Silver/DimCustomTime",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "DimCustomTime"
      },
      {
        "from": "src:Silver/DimCustomGeography",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "DimCustomGeography"
      },
      {
        "from": "src:Silver/DimFirstDatePartition",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "DimFirstDatePartition"
      },
      {
        "from": "src:Silver/DimAccountGeographyHierarchy_RoB",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "DimAccountGeographyHierarchy_RoB"
      },
      {
        "from": "src:Silver/FieldGeographyDefinition",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "FieldGeographyDefinition"
      },
      {
        "from": "src:Silver/DimFieldGeography",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "DimFieldGeography"
      },
      {
        "from": "src:Silver/DimOrganizationSubSegment",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "DimOrganizationSubSegment"
      },
      {
        "from": "src:Silver/DimSalesCustomer",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "DimSalesCustomer"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Gold_FactIPCoSellTransition",
        "to": "Cosell_Gold_FactIPCoSellTransition",
        "layer": "Gold",
        "table": "FactIPCoSellTransition"
      },
      {
        "from": "src:Silver/DimSalesGeography",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Silver",
        "table": "DimSalesGeography"
      },
      {
        "from": "Cosell_Silver_PartnerMaster",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Bronze",
        "table": "PartnerMaster"
      },
      {
        "from": "Cosell_Silver_Account",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Silver",
        "table": "Account"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "src:Gold/DimMSXCustomer",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "DimMSXCustomer"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "Cosell_Gold_DimCRMPartnerAccount",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "DimCRMPartnerAccount"
      },
      {
        "from": "Cosell_Gold_PipelinePartnerMaster",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "PipelinePartnerMaster"
      },
      {
        "from": "Cosell_Gold_DimGPSCRMAccount",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "DimGPSCRMAccount"
      },
      {
        "from": "Cosell_Gold_PartnerDealSolution_Snapshot",
        "to": "Cosell_Gold_FactAHRFeedAudit",
        "layer": "Gold",
        "table": "PartnerDealSolution_Snapshot"
      },
      {
        "from": "src:Gold/Opportunity_Internal",
        "to": "Cosell_Gold_FactCSPSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "Opportunity_Internal"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactCSPSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactCSPSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "Cosell_Gold_DimMSXWorkload",
        "to": "Cosell_Gold_FactCSPSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "DimMSXWorkLoad"
      },
      {
        "from": "Cosell_Gold_CSPSolutionInternal",
        "to": "Cosell_Gold_FactCSPSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "CSPSolutionInternal"
      },
      {
        "from": "Cosell_Gold_DimOpportunityReporting",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "DimOpportunityReporting"
      },
      {
        "from": "Cosell_Gold_DimSharingType",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "DimSharingType"
      },
      {
        "from": "Cosell_Gold_FactOpportunity",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "FactOpportunity"
      },
      {
        "from": "Cosell_Gold_DimPartnerReferralReporting",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "DimPartnerReferralReporting"
      },
      {
        "from": "Cosell_Gold_FactPartnerReferralReporting",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "FactPartnerReferralReporting"
      },
      {
        "from": "Cosell_Silver_DimProductHierarchy",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimProductHierarchy"
      },
      {
        "from": "src:Silver/DimRevSumHierarchy",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimRevSumHierarchy"
      },
      {
        "from": "Cosell_Gold_DimSolutionArea",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimSolutionArea"
      },
      {
        "from": "Cosell_Gold_DimSolutionAreaDetailReporting",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "DimSolutionAreaDetailReporting"
      },
      {
        "from": "Cosell_Gold_DimProduct",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimProduct"
      },
      {
        "from": "Cosell_Gold_DimSalesPlayReporting",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "DimSalesPlayReporting"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestoneReporting",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "DimEngagementMilestoneReporting"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "DimOpportunity"
      },
      {
        "from": "src:Silver/DimFiscalMonth",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimFiscalMonth"
      },
      {
        "from": "src:Silver/DimManagedTPAccount",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimManagedTPAccount"
      },
      {
        "from": "src:Silver/DimSegmentHierarchy",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimSegmentHierarchy"
      },
      {
        "from": "src:Silver/DimWorkload",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimWorkload"
      },
      {
        "from": "Cosell_Gold_FactMSXPartnerSharing",
        "to": "FactMSXCombined",
        "layer": "Gold",
        "table": "FactMSXPartnerSharing"
      },
      {
        "from": "src:Silver/DimCustomSellerManagerWorkloadsMaster",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimCustomSellerManagerWorkloadsMaster"
      },
      {
        "from": "src:Silver/DimCustomFieldSolutionAreaMapping",
        "to": "FactMSXCombined",
        "layer": "Silver",
        "table": "DimCustomFieldSolutionAreaMapping"
      },
      {
        "from": "src:Silver/PartnerImpactNumber",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Silver",
        "table": "PartnerImpactNumber"
      },
      {
        "from": "src:Silver/DimSalesGeography",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Silver",
        "table": "DimSalesGeography"
      },
      {
        "from": "Cosell_Silver_Account",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Silver",
        "table": "Account"
      },
      {
        "from": "Cosell_Gold_DimPartnerOne",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimPartnerOne"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Gold_DimGPSCRMAccount",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimGPSCRMAccount"
      },
      {
        "from": "src:Gold/DimEngagement",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimEngagement"
      },
      {
        "from": "src:Gold/DimGPSBusinessUnit",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimGPSBusinessUnit"
      },
      {
        "from": "Cosell_Gold_DimLifecycleStage",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimLifecycleStage"
      },
      {
        "from": "Cosell_Gold_MapAccountTag",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "MapAccountTag"
      },
      {
        "from": "Cosell_Gold_DimCapacityGeography",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimCapacityGeography"
      },
      {
        "from": "Cosell_Gold_DimSolutionEngagementPipeline",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimSolutionEngagementPipeline"
      },
      {
        "from": "src:Silver/OcpTechServiceRequest",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Silver",
        "table": "OcpTechServiceRequest"
      },
      {
        "from": "src:Silver/OcpCampaign",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Silver",
        "table": "OcpCampaign"
      },
      {
        "from": "src:Gold/DimEngagementTagsHidden",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimEngagementTagsHidden"
      },
      {
        "from": "Cosell_Gold_DimReportingPartnerOneSub",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimReportingPartnerOneSub"
      },
      {
        "from": "Cosell_Gold_DimRecruitLead",
        "to": "Cosell_Gold_FactAccount",
        "layer": "Gold",
        "table": "DimRecruitLead"
      },
      {
        "from": "src:Gold/Opportunity_Internal",
        "to": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "Opportunity_Internal"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "Cosell_Gold_DimMSXSolutionArea",
        "to": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "DimMSXSolutionArea"
      },
      {
        "from": "src:Gold/Opportunity_Internal",
        "to": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "Opportunity_Internal"
      },
      {
        "from": "Cosell_Gold_CSPSolutionInternal",
        "to": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "CSPSolutionInternal"
      },
      {
        "from": "Cosell_Gold_CSPSolutionInternal",
        "to": "Cosell_Gold_FactCSPSolutionPartnerDeal",
        "layer": "Gold",
        "table": "CSPSolutionInternal"
      },
      {
        "from": "Cosell_Gold_PCDeal_Internal",
        "to": "Cosell_Gold_FactCSPSolutionPartnerDeal",
        "layer": "Gold",
        "table": "PCDeal_Internal"
      },
      {
        "from": "Cosell_Gold_PSCDeal_Internal",
        "to": "Cosell_Gold_FactCSPSolutionPartnerDeal",
        "layer": "Gold",
        "table": "PSCDeal_Internal"
      },
      {
        "from": "Cosell_Gold_MapPartnerDealSolutionNameBasedMapping",
        "to": "Cosell_Gold_FactCSPSolutionPartnerDeal",
        "layer": "Gold",
        "table": "MapPartnerDealSolutionNameBasedMapping"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactCSPSolutionPartnerDeal",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "Cosell_Gold_DimPartnerReferralReporting",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "DimPartnerReferralReporting"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Gold_FactOpportunity",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "FactOpportunity"
      },
      {
        "from": "Cosell_Gold_PS_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "PS_DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimSharingType",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "DimSharingType"
      },
      {
        "from": "src:Silver/DimSegmentHierarchy",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Silver",
        "table": "DimSegmentHierarchy"
      },
      {
        "from": "src:Silver/DimSalesDate",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Silver",
        "table": "DimSalesDate"
      },
      {
        "from": "src:Silver/DimFiscalMonth",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Silver",
        "table": "DimFiscalMonth"
      },
      {
        "from": "Cosell_Gold_Associated_DimPartnerReferral",
        "to": "Cosell_Gold_FactPartnerReferralReporting",
        "layer": "Gold",
        "table": "Associated_DimPartnerReferral"
      },
      {
        "from": "Cosell_Gold_MapSolutionPracticeIndustryCountry",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "MapSolutionPracticeIndustryCountry"
      },
      {
        "from": "Cosell_Gold_DimSellercosellIncentive",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimSellerCoSellIncentive"
      },
      {
        "from": "Cosell_Gold_DimPartnerDealSolutionHistory",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimPartnerDealSolutionHistory"
      },
      {
        "from": "Cosell_Gold_DimPartnerdeal_int",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal_int",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "FactPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_PartnerDealSolution_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "PartnerDealSolution_Snapshot"
      },
      {
        "from": "Cosell_Silver_PartnerMaster",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Bronze",
        "table": "PartnerMaster"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Silver/Bridge_CascadedPartnerOne",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Silver",
        "table": "Bridge_CascadedPartnerOne"
      },
      {
        "from": "Cosell_Gold_DimPartner",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Silver",
        "table": "DimPartner"
      },
      {
        "from": "Cosell_Gold_FactSolution",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "FactSolution"
      },
      {
        "from": "Cosell_Gold_DimChannelPartner",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimChannelPartner"
      },
      {
        "from": "Cosell_Gold_SellerCoSellIncentiveSolution",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "SellerCoSellIncentiveSolution"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "MapSolutionPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimISVConnectApp",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimISVConnectApp"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactIPCoSell",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "FactIPCoSell"
      },
      {
        "from": "Cosell_Gold_DimIPPartner",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimIPPartner"
      },
      {
        "from": "Cosell_Gold_DimIPCosell",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimIPCosell"
      },
      {
        "from": "Cosell_Gold_DimIPCoSell_D365",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "DimIPCoSell_D365"
      },
      {
        "from": "Cosell_Gold_MarketplaceDealsACV_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal",
        "layer": "Gold",
        "table": "MarketplaceDealsACV_Snapshot"
      },
      {
        "from": "Cosell_Gold_DimOpportunityReporting",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "DimOpportunityReporting"
      },
      {
        "from": "Cosell_Gold_DimSharingType",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "DimSharingType"
      },
      {
        "from": "Cosell_Gold_FactOpportunity",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "FactOpportunity"
      },
      {
        "from": "Cosell_Gold_DimPartnerReferralReporting",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "DimPartnerReferralReporting"
      },
      {
        "from": "Cosell_Gold_FactPartnerReferralReporting",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "FactPartnerReferralReporting"
      },
      {
        "from": "Cosell_Gold_FactMSXPartnerSharing",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "FactMSXPartnerSharing"
      },
      {
        "from": "Cosell_Silver_DimProductHierarchy",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Silver",
        "table": "DimProductHierarchy"
      },
      {
        "from": "src:Silver/DimRevSumHierarchy",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Silver",
        "table": "DimRevSumHierarchy"
      },
      {
        "from": "Cosell_Gold_DimSolutionArea",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Silver",
        "table": "DimSolutionArea"
      },
      {
        "from": "Cosell_Gold_DimSolutionAreaDetailReporting",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "DimSolutionAreaDetailReporting"
      },
      {
        "from": "Cosell_Gold_DimProduct",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Silver",
        "table": "DimProduct"
      },
      {
        "from": "Cosell_Gold_DimSalesPlayReporting",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "DimSalesPlayReporting"
      },
      {
        "from": "Cosell_Gold_MapOpportunitySolution",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "MapOpportunitySolution"
      },
      {
        "from": "DimCustomPartnerDealDirectionReporting",
        "to": "Cosell_Gold_FactOpportunityReporting",
        "layer": "Gold",
        "table": "DimCustomPartnerDealDirectionReporting"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_DimIndustry",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimIndustry"
      },
      {
        "from": "Cosell_Silver_SolutionIndustryAssociation",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Silver",
        "table": "SolutionIndustryAssociation"
      },
      {
        "from": "src:Silver/OcpCampaign",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Silver",
        "table": "OcpCampaign"
      },
      {
        "from": "src:Silver/OcpTechServiceRequest",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Silver",
        "table": "OcpTechServiceRequest"
      },
      {
        "from": "src:Silver/BuildWithEngagement",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Silver",
        "table": "BuildWithEngagement"
      },
      {
        "from": "Cosell_Gold_MapSolutionPractice",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "MapSolutionPractice"
      },
      {
        "from": "Cosell_Gold_MapIndustrysolution",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "MapIndustrySolution"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "Cosell_Gold_DimPartnerOne",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimPartnerOne"
      },
      {
        "from": "Cosell_Gold_FactLessSolutionEngagement",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "FactLessSolutionEngagement"
      },
      {
        "from": "Cosell_Gold_DimSellercosellIncentive",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimSellerCoSellIncentive"
      },
      {
        "from": "src:Gold/DimEngagementTagsHidden",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimEngagementTagsHidden"
      },
      {
        "from": "Cosell_Gold_MapPartnerOneAccountTag",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "MapPartnerOneAccountTag"
      },
      {
        "from": "Cosell_Gold_MapSolutionEngagement",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "MapSolutionEngagement"
      },
      {
        "from": "src:Gold/DimEngagement",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimEngagement"
      },
      {
        "from": "Cosell_Gold_DimISVConnectApp",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimISVConnectApp"
      },
      {
        "from": "Cosell_Gold_SellerCoSellIncentiveSolution",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "SellerCoSellIncentiveSolution"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "Cosell_Gold_DimSolutionArea",
        "to": "Cosell_Gold_FactSolution",
        "layer": "Gold",
        "table": "DimSolutionArea"
      },
      {
        "from": "src:Gold/goldint_FactEngagementMilestone",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "goldint_FactEngagementMilestone"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestoneReporting",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "DimEngagementMilestoneReporting"
      },
      {
        "from": "Cosell_Gold_DimSharingType",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "DimSharingType"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Gold_FactOpportunity",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "FactOpportunity"
      },
      {
        "from": "Cosell_Gold_DimOpportunityReporting",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "DimOpportunityReporting"
      },
      {
        "from": "Cosell_Gold_FactOpportunityReporting",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "FactOpportunityReporting"
      },
      {
        "from": "src:Silver/DimFiscalMonth",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Silver",
        "table": "DimFiscalMonth"
      },
      {
        "from": "src:Silver/DimManagedTPAccount",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Silver",
        "table": "DimManagedTPAccount"
      },
      {
        "from": "src:Silver/DimSegmentHierarchy",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Silver",
        "table": "DimSegmentHierarchy"
      },
      {
        "from": "src:Silver/DimWorkload",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Silver",
        "table": "DimWorkload"
      },
      {
        "from": "Cosell_Gold_DimSolutionAreaDetailReporting",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "DimSolutionAreaDetailReporting"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactEngagementMilestoneReporting",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestone",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimEngagementMilestone_int"
      },
      {
        "from": "Cosell_Gold_FactEngagementMilestone",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "FactEngagementMilestone"
      },
      {
        "from": "src:Silver/Hub_vw_Currency",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "Hub_vw_Currency"
      },
      {
        "from": "Cosell_Gold_FactOpportunity_int",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "FactOpportunity_int"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal_int",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "FactPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimSharingType",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimSharingType"
      },
      {
        "from": "Cosell_Gold_FactOpportunity",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "FactOpportunity"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimCRMPartnerAccount",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimCRMPartnerAccount"
      },
      {
        "from": "Cosell_Gold_CustomerHQAccountsDim",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "CustomerHQAccountsDim_int"
      },
      {
        "from": "Cosell_Silver_DimReportingGeography",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "DimReportingGeography"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Silver/VWDimGeography",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "VWDimGeography"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "src:Silver/Bridge_CascadedPartnerOne",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "Bridge_CascadedPartnerOne"
      },
      {
        "from": "Cosell_Silver_DimRevenueAccount",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "DimRevenueAccount"
      },
      {
        "from": "Cosell_Gold_OpportunityDraftIntermediate",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "OpportunityDraftIntermediate"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Gold_DimSolutionAreaOppty",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimSolutionAreaOppty"
      },
      {
        "from": "Cosell_Gold_DimMSXWorkload",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "DimMSXWorkLoad"
      },
      {
        "from": "src:Gold/goldint_FactEngagementMilestone",
        "to": "Cosell_Gold_FactEngagementMilestone",
        "layer": "Gold",
        "table": "goldint_FactEngagementMilestone"
      },
      {
        "from": "src:Gold/PartnerDealSolutionNameBasedMapping",
        "to": "Cosell_Gold_FactSolutionPartnerDeal",
        "layer": "Gold",
        "table": "PartnerDealSolutionNameBasedMapping"
      },
      {
        "from": "Cosell_Gold_Solution_Internal",
        "to": "Cosell_Gold_FactSolutionPartnerDeal",
        "layer": "Gold",
        "table": "Solution_Internal"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactSolutionPartnerDeal",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_PSCDeal_Internal",
        "to": "Cosell_Gold_FactSolutionPartnerDeal",
        "layer": "Gold",
        "table": "PSCDeal_Internal"
      },
      {
        "from": "Cosell_Gold_PCDeal_Internal",
        "to": "Cosell_Gold_FactSolutionPartnerDeal",
        "layer": "Gold",
        "table": "PCDeal_Internal"
      },
      {
        "from": "Cosell_Gold_MapPartnerDealSolutionNameBasedMapping",
        "to": "Cosell_Gold_FactSolutionPartnerDeal",
        "layer": "Gold",
        "table": "MapPartnerDealSolutionNameBasedMapping"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactSolutionPartnerDeal",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "Cosell_Gold_FactOpportunity",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "layer": "Gold",
        "table": "FactOpportunity"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestone",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "layer": "Gold",
        "table": "DimEngagementMilestone"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "layer": "Gold",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "src:Gold/DimMSXCustomer",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "layer": "Gold",
        "table": "DimMSXCustomer"
      },
      {
        "from": "Cosell_Silver_DimReportingGeography",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "layer": "Silver",
        "table": "DimReportingGeography"
      },
      {
        "from": "Cosell_Silver_SolutionArea",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "SolutionArea"
      },
      {
        "from": "src:Gold/FactPipelineCurrent",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "FactPipelineCurrent"
      },
      {
        "from": "src:Silver/DimAccountGeographyHierarchy",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimAccountGeographyHierarchy"
      },
      {
        "from": "src:Silver/DimAllAccounts",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimAllAccounts"
      },
      {
        "from": "Cosell_Silver_DimPricingLevelHierarchy",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimPricingLevelHierarchy"
      },
      {
        "from": "Cosell_Silver_DimReportedSubsegmentHierarchy",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimReportedSubSegmentHierarchy"
      },
      {
        "from": "Cosell_Gold_CustomerHQAccountsDim",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "CustomerHQAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal_int",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "FactPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Gold_FactOpportunitiesSalesCycleDuration",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "FactOpportunitiesSalesCycleDuration"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Silver_DimRevenueAccount",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimRevenueAccount"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Silver_DimProductHierarchy",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimProductHierarchy"
      },
      {
        "from": "src:Silver/DimRevSumHierarchy",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimRevSumHierarchy"
      },
      {
        "from": "Cosell_Gold_DimLead",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimLead"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "Cosell_Gold_FactEngagementMilestone",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "FactEngagementMilestone"
      },
      {
        "from": "Cosell_Gold_FactEngagementMilestone",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "FactEngagementMilestone"
      },
      {
        "from": "src:Silver/DimFiscalMonth",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimFiscalMonth"
      },
      {
        "from": "src:Gold/DimHC360Personnel",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimHC360Personnel"
      },
      {
        "from": "src:Gold/DimManagerList",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimManagerList"
      },
      {
        "from": "Cosell_Silver_DimReportingGeography",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimReportingGeography"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Silver/VWDimGeography",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "VWDimGeography"
      },
      {
        "from": "src:Silver/Bridge_CascadedPartnerOne",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "Bridge_CascadedPartnerOne"
      },
      {
        "from": "src:Gold/DimChannelManager",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimChannelManager"
      },
      {
        "from": "Cosell_Gold_OpportunityDraftIntermediate",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "OpportunityDraftIntermediate"
      },
      {
        "from": "src:Silver/Hub_vw_Account",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "Hub_vw_Account"
      },
      {
        "from": "src:Silver/DimSalesGeography",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "DimSalesGeography"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestone",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Gold",
        "table": "DimEngagementMilestone_int"
      },
      {
        "from": "src:Silver/Hub_vw_Currency",
        "to": "Cosell_Gold_FactOpportunity",
        "layer": "Silver",
        "table": "Hub_vw_Currency"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Silver",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Silver_DimPricingLevelHierarchy",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Bronze",
        "table": "DimPricingLevelHierarchy"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Silver_FactPipeline",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Silver",
        "table": "FactPipeline"
      },
      {
        "from": "Cosell_Silver_DimProductHierarchy",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Silver",
        "table": "DimProductHierarchy"
      },
      {
        "from": "src:Silver/DimFiscalMonth",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Silver",
        "table": "DimFiscalMonth"
      },
      {
        "from": "src:Silver/DimSalesDate",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Silver",
        "table": "DimSalesDate"
      },
      {
        "from": "Cosell_Gold_FactEngagementMilestone",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Silver",
        "table": "FactEngagementMilestone"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestone",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Silver",
        "table": "DimEngagementMilestone"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_FactOpportunity",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "FactOpportunity"
      },
      {
        "from": "src:Gold/DimMSXCustomer",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimMSXCustomer"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "Cosell_Gold_DimCRMPartnerAccount",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimCRMPartnerAccount"
      },
      {
        "from": "Cosell_Gold_MapSolutionPracticeIndustryCountry",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "MapSolutionPracticeIndustryCountry"
      },
      {
        "from": "Cosell_Gold_DimCapacityGeography",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimCapacityGeography"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimReportingPartnerOneSub",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimReportingPartnerOneSub"
      },
      {
        "from": "Cosell_Gold_DimSolutionAreaOppty",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimSolutionAreaOppty"
      },
      {
        "from": "Cosell_Gold_DimRevSumDivision",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimRevSumDivision"
      },
      {
        "from": "Cosell_Gold_DimMSXSolutionArea",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimMSXSolutionArea"
      },
      {
        "from": "Cosell_Gold_DimMSXWorkload",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "DimMSXWorkLoad"
      },
      {
        "from": "Cosell_Gold_Associated_DimPartnerReferral",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "Associated_DimPartnerReferral"
      },
      {
        "from": "src:Gold/dimpartnersharingexclusion_billedpipeline",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "dimpartnersharingexclusion_billedpipeline"
      },
      {
        "from": "src:Gold/factmsxpartnersharing_stage1",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "factmsxpartnersharing_stage1"
      },
      {
        "from": "src:Gold/factmsxpartnersharing_stage2",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "factmsxpartnersharing_stage2"
      },
      {
        "from": "src:Gold/factmsxpartnersharing_stage3",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "factmsxpartnersharing_stage3"
      },
      {
        "from": "src:Gold/FactMSXPartnerSharing_Billed",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "FactMSXPartnerSharing_Billed"
      },
      {
        "from": "src:Gold/FactMSXPartnerSharing_Consumption",
        "to": "Cosell_Gold_FactMSXPartnerSharing",
        "layer": "Gold",
        "table": "FactMSXPartnerSharing_Consumption"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal_int",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "FactPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_DimPartnerdeal_int",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "DimPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_DimIPCosell",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "DimIPCosell"
      },
      {
        "from": "Cosell_Gold_DimGPSCRMAccount",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "DimGPSCRMAccount"
      },
      {
        "from": "Cosell_Gold_PartnerDealSolution_Snapshot",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "PartnerDealSolution_Snapshot"
      },
      {
        "from": "Cosell_Gold_TrueACRPartnerDeal_int",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "TrueACRPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "Cosell_Gold_dimtoptiermonthlystatus",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "DimTopTierMonthlyStatus"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Silver_PartnerMaster",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Silver",
        "table": "PartnerMaster"
      },
      {
        "from": "src:Gold/DimMSXCustomer",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "DimMSXCustomer"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_MarketplaceDealsACV_Snapshot",
        "to": "Cosell_Gold_FactIPCoSell",
        "layer": "Gold",
        "table": "MarketplaceDealsACV_Snapshot"
      },
      {
        "from": "Cosell_Gold_DimMSXWorkload",
        "to": "Cosell_Gold_FactSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "DimMSXWorkLoad"
      },
      {
        "from": "src:Gold/Opportunity_Internal",
        "to": "Cosell_Gold_FactSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "Opportunity_Internal"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestone",
        "to": "Cosell_Gold_FactSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "DimEngagementMilestone_int"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "Cosell_Gold_Solution_Internal",
        "to": "Cosell_Gold_FactSolutionConsumptionOpportunity",
        "layer": "Gold",
        "table": "Solution_Internal"
      },
      {
        "from": "Cosell_Gold_FactOpportunityProduct",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "FactOpportunityProduct"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_FactOpportunityProduct_Internal",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "FactOpportunityProduct_Internal"
      },
      {
        "from": "src:Gold/Opportunity_Internal",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "Opportunity_Internal"
      },
      {
        "from": "Cosell_Gold_DimMSXSolutionArea",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "DimMSXSolutionArea"
      },
      {
        "from": "Cosell_Gold_Solution_Internal",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "Solution_Internal"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactSolutionBilledOpportunity",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "Cosell_Gold_DimLead",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "DimLead"
      },
      {
        "from": "src:Silver/VWDimGeography",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "VWDimGeography"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_FactLead",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "FactLead_int"
      },
      {
        "from": "Cosell_Gold_DimLead",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "DimLead"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "src:Silver/DimAccountGeographyHierarchy",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "DimAccountGeographyHierarchy"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_DimCRMPartnerAccount",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "DimCRMPartnerAccount"
      },
      {
        "from": "Cosell_Gold_PipelinePartnerMaster",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "PipelinePartnerMaster"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Silver_DimReportingGeography",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "DimReportingGeography"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Silver/Bridge_CascadedPartnerOne",
        "to": "Cosell_Gold_FactLead",
        "layer": "Silver",
        "table": "Bridge_CascadedPartnerOne"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactLead",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Silver_SellInCountryMapping",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Silver",
        "table": "SellInCountryMapping"
      },
      {
        "from": "Cosell_Gold_DimCapacityGeography",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "DimCapacityGeography"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_FactSolution",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "FactSolution"
      },
      {
        "from": "Cosell_Gold_MapSolutionPracticeIndustryCountry",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "MapSolutionPracticeIndustryCountry"
      },
      {
        "from": "src:Gold/DimEngagement",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "DimEngagement"
      },
      {
        "from": "Cosell_Gold_DimSolutionEngagementPipeline",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "DimSolutionEngagementPipeline"
      },
      {
        "from": "Cosell_Gold_MapPartnerOneAccountTag",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "MapPartnerOneAccountTag"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerOneReportingPartnerOneSubAccount",
        "to": "Cosell_Gold_FactSolutionCapacityGeography",
        "layer": "Gold",
        "table": "MapSolutionPartnerOneReportingPartnerOneSubAccount"
      },
      {
        "from": "src:Silver/Map_Association_Partner_PPR",
        "to": "Cosell_Gold_FactAzureConsumptionCTCG",
        "layer": "Silver",
        "table": "Map_Association_Partner_PPR"
      },
      {
        "from": "src:Silver/DimAzureAssociationType",
        "to": "Cosell_Gold_FactAzureConsumptionCTCG",
        "layer": "Silver",
        "table": "DimAzureAssociationType"
      },
      {
        "from": "src:Silver/FactAzureConsumption",
        "to": "Cosell_Gold_FactAzureConsumptionCTCG",
        "layer": "Silver",
        "table": "FactAzureConsumption"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactAzureConsumptionCTCG",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "src:Silver/DimSalesGeoHierarchy",
        "to": "Cosell_Gold_FactAzureConsumptionCTCG",
        "layer": "Silver",
        "table": "DimSalesGeoHierarchy"
      },
      {
        "from": "src:Silver/Map_Association_Partner_PPR",
        "to": "Cosell_Gold_FactAzureConsumptionP1CGCT",
        "layer": "Silver",
        "table": "Map_Association_Partner_PPR"
      },
      {
        "from": "src:Silver/DimAzureAssociationType",
        "to": "Cosell_Gold_FactAzureConsumptionP1CGCT",
        "layer": "Silver",
        "table": "DimAzureAssociationType"
      },
      {
        "from": "src:Silver/FactAzureConsumption",
        "to": "Cosell_Gold_FactAzureConsumptionP1CGCT",
        "layer": "Silver",
        "table": "FactAzureConsumption"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactAzureConsumptionP1CGCT",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "src:Silver/DimSalesGeoHierarchy",
        "to": "Cosell_Gold_FactAzureConsumptionP1CGCT",
        "layer": "Silver",
        "table": "DimSalesGeoHierarchy"
      },
      {
        "from": "Cosell_Gold_GeographySubsidiaryHierarchyDim",
        "to": "Cosell_Gold_FactCosellTargets",
        "layer": "Gold",
        "table": "GeographySubsidiaryHierarchyDim"
      },
      {
        "from": "src:Silver/FactSubScorecardTargets",
        "to": "Cosell_Gold_FactCosellTargets",
        "layer": "Silver",
        "table": "FactSubScorecardTargets"
      },
      {
        "from": "Cosell_Gold_DimPartner",
        "to": "Cosell_Gold_FactCRMPartner",
        "layer": "Silver",
        "table": "DimPartner"
      },
      {
        "from": "Cosell_Gold_PipelinePartnerMaster",
        "to": "Cosell_Gold_FactCRMPartner",
        "layer": "Gold",
        "table": "PipelinePartnerMaster"
      },
      {
        "from": "Cosell_Gold_DimCRMPartnerAccount",
        "to": "Cosell_Gold_FactCRMPartner",
        "layer": "Gold",
        "table": "DimCRMPartnerAccount"
      },
      {
        "from": "Cosell_Silver_PartnerMaster",
        "to": "Cosell_Gold_FactCRMPartner",
        "layer": "Silver",
        "table": "PartnerMaster"
      },
      {
        "from": "src:Silver/VWDimGeography",
        "to": "Cosell_Gold_FactCRMPartner",
        "layer": "Silver",
        "table": "VWDimGeography"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactCRMPartner",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "src:Gold/DimGPSBusinessUnit",
        "to": "Cosell_Gold_FactCRMUser",
        "layer": "Gold",
        "table": "DimGPSBusinessUnit"
      },
      {
        "from": "Cosell_Gold_FactEngagementMilestonePipeline_int",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline",
        "layer": "Gold",
        "table": "FactEngagementMilestonePipeline_int"
      },
      {
        "from": "Cosell_Gold_DimMSXWorkload",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline",
        "layer": "Gold",
        "table": "DimMSXWorkLoad"
      },
      {
        "from": "Cosell_Gold_DimSolutionAreaOppty",
        "to": "Cosell_Gold_FactEngagementMilestonePipeline",
        "layer": "Gold",
        "table": "DimSolutionAreaOppty"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "src:Silver/vw_alliancereadiness",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Silver",
        "table": "vw_alliancereadiness"
      },
      {
        "from": "src:Silver/vw_certifications",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Silver",
        "table": "vw_certifications"
      },
      {
        "from": "Cosell_Gold_DimCapacityGeography",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Gold",
        "table": "DimCapacityGeography"
      },
      {
        "from": "Cosell_Gold_DimSolutionArea",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Gold",
        "table": "DimSolutionArea"
      },
      {
        "from": "Cosell_Gold_MapPartnerOneAccountTag",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Gold",
        "table": "MapPartnerOneAccountTag"
      },
      {
        "from": "Cosell_Gold_DimPartnerOne",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Gold",
        "table": "DimPartnerOne"
      },
      {
        "from": "Cosell_Silver_Actual",
        "to": "Cosell_Gold_FactFY20AllianceReadiness",
        "layer": "Silver",
        "table": "Actual"
      },
      {
        "from": "src:Silver/FactMarketplaceInvoice",
        "to": "Cosell_Gold_FactInvoice",
        "layer": "Silver",
        "table": "FactMarketplaceInvoice"
      },
      {
        "from": "Cosell_Gold_FinalActualAmount",
        "to": "Cosell_Gold_FactIOPO",
        "layer": "Gold",
        "table": "FinalActualAmount"
      },
      {
        "from": "Cosell_Gold_FinalInvoiceAmount",
        "to": "Cosell_Gold_FactIOPO",
        "layer": "Gold",
        "table": "FinalInvoiceAmount"
      },
      {
        "from": "src:Silver/FactISV",
        "to": "Cosell_Gold_FactISVConnect",
        "layer": "Silver",
        "table": "FactISV"
      },
      {
        "from": "Cosell_Gold_MapSolutionPractice",
        "to": "Cosell_Gold_FactISVConnect",
        "layer": "Gold",
        "table": "MapSolutionPractice"
      },
      {
        "from": "Cosell_Gold_MapIndustrysolution",
        "to": "Cosell_Gold_FactISVConnect",
        "layer": "Gold",
        "table": "MapIndustrySolution"
      },
      {
        "from": "Cosell_Gold_DimISVConnectApp",
        "to": "Cosell_Gold_FactISVConnect",
        "layer": "Gold",
        "table": "DimISVConnectApp"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactLessSolutionEngagement",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_FactMarketPlaceOffer",
        "to": "Cosell_Gold_FactMarketPlaceOffer",
        "layer": "Silver",
        "table": "FactMarketplaceOffer"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "CoSell_Gold_FactMBSCommercialTargets",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "CoSell_Gold_FactMBSCommercialTargets",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "CoSell_Gold_FactMBSCommercialTargets",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "src:Silver/FactSalesStageVelocity",
        "to": "Cosell_Gold_FactOpportunitiesSalesCycleDuration",
        "layer": "Silver",
        "table": "FactSalesStageVelocity"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactOpportunitiesSalesCycleDuration",
        "layer": "Silver",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Gold_FactOpportunityProduct",
        "to": "Cosell_Gold_FactOpportunityProduct_Internal",
        "layer": "Gold",
        "table": "FactOpportunityProduct"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactOpportunityProduct_Internal",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactOpportunityProduct_Internal",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactOpportunityProduct_Internal",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimProductPFam",
        "to": "Cosell_Gold_FactOpportunityProduct",
        "layer": "Gold",
        "table": "DimProductPFam"
      },
      {
        "from": "Cosell_Silver_FactPipeline",
        "to": "Cosell_Gold_FactOpportunityProduct",
        "layer": "Silver",
        "table": "FactPipeline"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactOpportunityProduct",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimSellercosellIncentive",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "DimSellerCoSellIncentive"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "MapSolutionPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimPartnerDealSolutionHistory",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "DimPartnerDealSolutionHistory"
      },
      {
        "from": "Cosell_Gold_DimIPPartner",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "DimIPPartner"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/PartnerDealFY20_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal_FY20",
        "layer": "Gold",
        "table": "PartnerDealFY20_Snapshot"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimSellercosellIncentive",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "DimSellerCoSellIncentive"
      },
      {
        "from": "Cosell_Gold_MapSolutionPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "MapSolutionPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_DimPartnerDealSolutionHistory",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "DimPartnerDealSolutionHistory"
      },
      {
        "from": "Cosell_Gold_DimIPPartner",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "DimIPPartner"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/PartnerDealFY21_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal_FY21",
        "layer": "Gold",
        "table": "PartnerDealFY21_Snapshot"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY23",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY23",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactPartnerDeal_FY23",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPartnerDeal_FY23",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal_FY23",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/PartnerDealFY23_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal_FY23",
        "layer": "Gold",
        "table": "PartnerDealFY23_Snapshot"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY24",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY24",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactPartnerDeal_FY24",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPartnerDeal_FY24",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal_FY24",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/PartnerDealFY24_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal_FY24",
        "layer": "Gold",
        "table": "PartnerDealFY24_Snapshot"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY25",
        "layer": "Gold",
        "table": "DimPartnerDeal"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal",
        "to": "Cosell_Gold_FactPartnerDeal_FY25",
        "layer": "Gold",
        "table": "FactPartnerDeal"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactPartnerDeal_FY25",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPartnerDeal_FY25",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal_FY25",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/PartnerDealFY25_Snapshot",
        "to": "Cosell_Gold_FactPartnerDeal_FY25",
        "layer": "Gold",
        "table": "PartnerDealFY25_Snapshot"
      },
      {
        "from": "src:Gold/PartnerDealIntermediate",
        "to": "Cosell_Gold_FactPartnerDealDuration",
        "layer": "Gold",
        "table": "PartnerDealIntermediate"
      },
      {
        "from": "Cosell_Gold_ReferralCycleTimeUnpivoted",
        "to": "Cosell_Gold_FactPartnerDealDuration",
        "layer": "Gold",
        "table": "ReferralCycleTimeUnpivoted"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactPartnerOne",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "Cosell_Gold_FactSolution",
        "to": "Cosell_Gold_FactPartnerOne",
        "layer": "Gold",
        "table": "FactSolution"
      },
      {
        "from": "Cosell_Gold_DimSolution",
        "to": "Cosell_Gold_FactPartnerOne",
        "layer": "Gold",
        "table": "DimSolution"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal_int",
        "to": "Cosell_Gold_FactPartnerOne",
        "layer": "Gold",
        "table": "FactPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_MapPartnerOneAccountTag",
        "to": "Cosell_Gold_FactPartnerOne",
        "layer": "Gold",
        "table": "MapPartnerOneAccountTag"
      },
      {
        "from": "src:Silver/PRACRTargetsData",
        "to": "Cosell_Gold_FactPRACRTargets",
        "layer": "Silver",
        "table": "PRACRTargetsData"
      },
      {
        "from": "src:Silver/PRACRTargetsData_FY22",
        "to": "Cosell_Gold_FactPRACRTargets",
        "layer": "Silver",
        "table": "PRACRTargetsData_FY22"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactPRACRTargets",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPRACRTargets",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPRACRTargets",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "src:Silver/Project",
        "to": "CoSell_Gold_FactProject",
        "layer": "Silver",
        "table": "Project"
      },
      {
        "from": "src:Gold/DimProjectTask",
        "to": "CoSell_Gold_FactProject",
        "layer": "Gold",
        "table": "DimProjectTask"
      },
      {
        "from": "src:Gold/DimProjectDeliverables",
        "to": "CoSell_Gold_FactProject",
        "layer": "Gold",
        "table": "DimProjectDeliverables"
      },
      {
        "from": "src:Gold/DimGPSBusinessUnit",
        "to": "Cosell_Gold_FactRecruitISVTargets",
        "layer": "Gold",
        "table": "DimGPSBusinessUnit"
      },
      {
        "from": "src:Silver/DimSalesGeography",
        "to": "Cosell_Gold_FactRecruitISVTargets",
        "layer": "Silver",
        "table": "DimSalesGeography"
      },
      {
        "from": "src:Silver/GL04ProfitCenter",
        "to": "Cosell_Gold_HC360PersonnelFact",
        "layer": "Silver",
        "table": "GL04ProfitCenter"
      },
      {
        "from": "src:Silver/GL04CostCenter",
        "to": "Cosell_Gold_HC360PersonnelFact",
        "layer": "Silver",
        "table": "GL04CostCenter"
      },
      {
        "from": "src:Silver/GL04GeographyHierarchy",
        "to": "Cosell_Gold_HC360PersonnelFact",
        "layer": "Silver",
        "table": "GL04GeographyHierarchy"
      },
      {
        "from": "src:Silver/HC01HCActualSummary",
        "to": "Cosell_Gold_HC360PersonnelFact",
        "layer": "Silver",
        "table": "HC01HCActualSummary"
      },
      {
        "from": "src:Silver/DimFiscalMonth",
        "to": "Cosell_Gold_HC360PersonnelFact",
        "layer": "Silver",
        "table": "DimFiscalMonth"
      },
      {
        "from": "src:Silver/DimPerson",
        "to": "Cosell_Gold_HC360PersonnelFact",
        "layer": "Silver",
        "table": "DimPerson"
      },
      {
        "from": "Cosell_Silver_factpartnerdeal_snapshot",
        "to": "Cosell_Gold_PartnerDealFact",
        "layer": "Silver",
        "table": "FactPartnerDeal_SnapShot"
      },
      {
        "from": "Cosell_Gold_DimPartnerDeal",
        "to": "Cosell_Gold_PartnerDealFact",
        "layer": "Bronze",
        "table": "DimPartnerDeal"
      },
      {
        "from": "TPP_Silver_DimPartnerAccount",
        "to": "Cosell_Gold_PartnerDealFact",
        "layer": "Silver",
        "table": "DimPartnerAccount"
      },
      {
        "from": "src:Silver/Hub_vw_Account",
        "to": "Cosell_Gold_PartnerDealFact",
        "layer": "Silver",
        "table": "Hub_vw_Account"
      },
      {
        "from": "Cosell_Silver_DimRevenueAccount",
        "to": "Cosell_Gold_PartnerDealFact",
        "layer": "Silver",
        "table": "DimRevenueAccount"
      },
      {
        "from": "Cosell_Gold_CustomerHQAccountsDim",
        "to": "Cosell_Gold_PartnerDealFact",
        "layer": "Gold",
        "table": "CustomerHQAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_PartnerDealFact",
        "layer": "Silver",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Silver_FactPipeline",
        "to": "Cosell_Gold_PipelineFactCurrent",
        "layer": "Silver",
        "table": "FactPipeline"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_PipelineFactCurrent",
        "layer": "Silver",
        "table": "DimOpportunity"
      },
      {
        "from": "src:Silver/MapAzureAssociationPartner",
        "to": "PSA_Gold_FactAzureConsumptionP1",
        "layer": "Silver",
        "table": "MapAzureAssociationPartner"
      },
      {
        "from": "src:Silver/DimAssociationType",
        "to": "PSA_Gold_FactAzureConsumptionP1",
        "layer": "Silver",
        "table": "DimAssociationType"
      },
      {
        "from": "src:Silver/FactAzureConsumption",
        "to": "PSA_Gold_FactAzureConsumptionP1",
        "layer": "Silver",
        "table": "FactAzureConsumption"
      },
      {
        "from": "src:Silver/DimSalesGeoHierarchy",
        "to": "PSA_Gold_FactAzureConsumptionP1",
        "layer": "Silver",
        "table": "DimSalesGeoHierarchy"
      },
      {
        "from": "src:Silver/DimACRAdjustmentType",
        "to": "PSA_Gold_FactAzureConsumptionP1",
        "layer": "Silver",
        "table": "DimACRAdjustmentType"
      },
      {
        "from": "src:Gold/FactPipelineCurrent",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "FactPipelineCurrent"
      },
      {
        "from": "Cosell_Gold_CustomerHQAccountsDim",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "CustomerHQAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_FactPartnerDeal_int",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "FactPartnerDeal_int"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_FactOpportunitiesSalesCycleDuration",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "FactOpportunitiesSalesCycleDuration"
      },
      {
        "from": "Cosell_Gold_TPAccountsDim",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "TPAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_DimLead",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimLead"
      },
      {
        "from": "src:Gold/DimHC360Personnel",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimHC360Personnel"
      },
      {
        "from": "src:Gold/DimManagerList",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimManagerList"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/DimChannelManager",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimChannelManager"
      },
      {
        "from": "Cosell_Gold_OpportunityDraftIntermediate",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "OpportunityDraftIntermediate"
      },
      {
        "from": "Cosell_Gold_DimEngagementMilestone",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Gold",
        "table": "DimEngagementMilestone_int"
      },
      {
        "from": "Cosell_Silver_SolutionArea",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "SolutionArea"
      },
      {
        "from": "src:Silver/DimAccountGeographyHierarchy",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimAccountGeographyHierarchy"
      },
      {
        "from": "src:Silver/DimAllAccounts",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimAllAccounts"
      },
      {
        "from": "Cosell_Silver_DimPricingLevelHierarchy",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimPricingLevelHierarchy"
      },
      {
        "from": "Cosell_Silver_DimReportedSubsegmentHierarchy",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimReportedSubSegmentHierarchy"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Silver_DimRevenueAccount",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimRevenueAccount"
      },
      {
        "from": "Cosell_Silver_DimProductHierarchy",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimProductHierarchy"
      },
      {
        "from": "src:Silver/DimRevSumHierarchy",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimRevSumHierarchy"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "Cosell_Gold_FactEngagementMilestone",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "FactEngagementMilestone"
      },
      {
        "from": "src:Silver/DimFiscalMonth",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimFiscalMonth"
      },
      {
        "from": "Cosell_Silver_DimReportingGeography",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimReportingGeography"
      },
      {
        "from": "src:Silver/VWDimGeography",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "VWDimGeography"
      },
      {
        "from": "src:Silver/Bridge_CascadedPartnerOne",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "Bridge_CascadedPartnerOne"
      },
      {
        "from": "src:Silver/Hub_vw_Account",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "Hub_vw_Account"
      },
      {
        "from": "src:Silver/DimSalesGeography",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "DimSalesGeography"
      },
      {
        "from": "src:Silver/Hub_vw_Currency",
        "to": "Cosell_Gold_FactOpportunity_int",
        "layer": "Silver",
        "table": "Hub_vw_Currency"
      },
      {
        "from": "Cosell_Gold_DimPartnerdeal_int",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimPartnerDeal_int"
      },
      {
        "from": "src:Gold/PartnerDealIntermediate",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "PartnerDealIntermediate"
      },
      {
        "from": "Cosell_Gold_DimLead",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimLead"
      },
      {
        "from": "Cosell_Gold_DimPartnerOne",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimPartnerOne"
      },
      {
        "from": "Cosell_Gold_CustomerHQAccountsDim",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "CustomerHQAccountsDim_int"
      },
      {
        "from": "Cosell_Gold_DimCRMPartnerAccount",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimCRMPartnerAccount"
      },
      {
        "from": "Cosell_Gold_DimCustomerSegment",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimCustomerSegment"
      },
      {
        "from": "Cosell_Gold_DimOpportunity_Int",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimOpportunity_int"
      },
      {
        "from": "Cosell_Gold_PipelinePartnerMaster",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "PipelinePartnerMaster"
      },
      {
        "from": "Cosell_Gold_dimcustomergeography",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimCustomerGeography"
      },
      {
        "from": "src:Gold/DimManagerList",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimManagerList"
      },
      {
        "from": "Cosell_Gold_DimScoreCardRecognitionTime",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimScoreCardRecognitionTime"
      },
      {
        "from": "Cosell_Gold_DimPartnerDealProfile",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Gold",
        "table": "DimPartnerDealProfile"
      },
      {
        "from": "src:Silver/Hub_vw_Currency",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "Hub_vw_Currency"
      },
      {
        "from": "src:Silver/Hub_vw_Account",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "Hub_vw_Account"
      },
      {
        "from": "src:Silver/DimSalesGeography",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "DimSalesGeography"
      },
      {
        "from": "src:Silver/Currency",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "Currency"
      },
      {
        "from": "src:Silver/VWDimGeography",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "VWDimGeography"
      },
      {
        "from": "Cosell_Gold_DimOpportunity",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "DimOpportunity"
      },
      {
        "from": "Cosell_Gold_DimTime",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "DimTime"
      },
      {
        "from": "Cosell_Silver_PartnerMaster",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "PartnerMaster"
      },
      {
        "from": "Cosell_Silver_DimRevenueAccount",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "DimRevenueAccount"
      },
      {
        "from": "src:Silver/ReportingPartnerOne",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "ReportingPartnerOne"
      },
      {
        "from": "src:Silver/Bridge_CascadedPartnerOne",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "Bridge_CascadedPartnerOne"
      },
      {
        "from": "Cosell_Silver_DimReportingGeography",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "DimReportingGeography"
      },
      {
        "from": "src:Silver/PartnerMarketingProfilePII",
        "to": "Cosell_Gold_FactPartnerDeal_int",
        "layer": "Silver",
        "table": "PartnerMarketingProfilePII"
      }
    ],
    "stats": {
      "facts": 59,
      "nodes": 227,
      "edges": 551,
      "resolvedEdges": 381,
      "sourceEdges": 170
    }
  },
  "stream": {
    "nodes": [
      {
        "id": "upstream",
        "type": "source",
        "label": "Upstream (D365/AMM/SharePoint/Marketplace)"
      },
      {
        "id": "cosell",
        "type": "stream",
        "nb": 387,
        "label": "CoSell Core"
      },
      {
        "id": "comarketing",
        "type": "stream",
        "nb": 24,
        "label": "Co-Marketing"
      },
      {
        "id": "planning",
        "type": "stream",
        "nb": 11,
        "label": "Planning"
      },
      {
        "id": "dracr",
        "type": "stream",
        "nb": 11,
        "label": "DRACR Planning"
      },
      {
        "id": "tpp",
        "type": "stream",
        "nb": 27,
        "label": "Joint Planning (TPP)"
      },
      {
        "id": "majors",
        "type": "stream",
        "nb": 20,
        "label": "Majors (MPR)"
      },
      {
        "id": "redcarpet",
        "type": "stream",
        "nb": 27,
        "label": "RedCarpet"
      },
      {
        "id": "pracflow",
        "type": "stream",
        "nb": 5,
        "label": "PRACFlow"
      },
      {
        "id": "m_cosell",
        "type": "model",
        "label": "CoSellSemanticModel"
      },
      {
        "id": "m_comkt",
        "type": "model",
        "label": "CoMarketingModel"
      },
      {
        "id": "m_majors",
        "type": "model",
        "label": "majors/MRoB Model"
      },
      {
        "id": "m_tpp",
        "type": "model",
        "label": "TPP_Dataset_Model"
      },
      {
        "id": "m_psharing",
        "type": "model",
        "label": "PartnerSharingModel"
      },
      {
        "id": "m_planning",
        "type": "model",
        "label": "Partner Planning & Transition"
      }
    ],
    "edges": [
      {
        "from": "upstream",
        "to": "cosell"
      },
      {
        "from": "upstream",
        "to": "comarketing"
      },
      {
        "from": "upstream",
        "to": "majors"
      },
      {
        "from": "upstream",
        "to": "tpp"
      },
      {
        "from": "upstream",
        "to": "redcarpet"
      },
      {
        "from": "upstream",
        "to": "pracflow"
      },
      {
        "from": "cosell",
        "to": "comarketing",
        "label": "conformed dims"
      },
      {
        "from": "cosell",
        "to": "planning",
        "label": "conformed dims"
      },
      {
        "from": "cosell",
        "to": "dracr",
        "label": "_Planning_Feed"
      },
      {
        "from": "cosell",
        "to": "pracflow"
      },
      {
        "from": "cosell",
        "to": "m_cosell"
      },
      {
        "from": "comarketing",
        "to": "m_comkt"
      },
      {
        "from": "majors",
        "to": "m_majors"
      },
      {
        "from": "tpp",
        "to": "m_tpp"
      },
      {
        "from": "cosell",
        "to": "m_psharing"
      },
      {
        "from": "planning",
        "to": "m_planning"
      },
      {
        "from": "dracr",
        "to": "m_planning"
      }
    ]
  },
  "pipeline": {
    "nodes": [
      {
        "id": "cfg",
        "type": "config",
        "label": "GetConfiguration (config store)"
      },
      {
        "id": "cs_master",
        "stream": "CoSell",
        "type": "master",
        "label": "CoSell_Master_Pipeline"
      },
      {
        "id": "cs_status",
        "stream": "CoSell",
        "type": "gate",
        "label": "Get_Status_Flag (SP gate)"
      },
      {
        "id": "cs_init",
        "stream": "CoSell",
        "type": "init",
        "label": "Initiate_Refresh"
      },
      {
        "id": "cs_bronze",
        "stream": "CoSell",
        "type": "bronze",
        "label": "CoSell_Bronze_Pipeline"
      },
      {
        "id": "cs_bval",
        "stream": "CoSell",
        "type": "validate",
        "label": "CoSell_Bronze_Validate"
      },
      {
        "id": "cs_powerapp",
        "stream": "CoSell",
        "type": "ext",
        "label": "PowerApp (Dataverse)"
      },
      {
        "id": "cs_silver",
        "stream": "CoSell",
        "type": "silver",
        "label": "CoSell_Silver_Pipeline"
      },
      {
        "id": "cs_sval",
        "stream": "CoSell",
        "type": "validate",
        "label": "Notebook_Silver_Validate"
      },
      {
        "id": "cs_goldv1",
        "stream": "CoSell",
        "type": "gold",
        "label": "CoSell_Gold_Pipeline (V1)"
      },
      {
        "id": "cs_goldv2",
        "stream": "CoSell",
        "type": "gold",
        "label": "Gold_Pipeline_V2"
      },
      {
        "id": "cs_goldval",
        "stream": "CoSell",
        "type": "validate",
        "label": "CoSell_Gold_Validation"
      },
      {
        "id": "cs_publish",
        "stream": "CoSell",
        "type": "publish",
        "label": "CoSell_Publish_Schema_Pipeline"
      },
      {
        "id": "cs_reset",
        "stream": "CoSell",
        "type": "reset",
        "label": "Cosell_Reset_Flag"
      },
      {
        "id": "cs_goldv3",
        "stream": "CoSell",
        "type": "dead",
        "label": "Cosell_Gold_Pipeline_V3 (DEAD)"
      },
      {
        "id": "cs_goldv4",
        "stream": "CoSell",
        "type": "dead",
        "label": "CoSell_Gold_Pipeline_V4 (DEAD)"
      },
      {
        "id": "cs_goldv2b",
        "stream": "CoSell",
        "type": "dead",
        "label": "Gold_Pipeline_V2 alt (DEAD?)"
      },
      {
        "id": "ps_master",
        "stream": "CoSell",
        "type": "master",
        "label": "PartnerSharing_Master_Pipeline"
      },
      {
        "id": "ps_gold",
        "stream": "CoSell",
        "type": "gold",
        "label": "PartnerSharing_Gold_Pipeline"
      },
      {
        "id": "cm_master",
        "stream": "CoMarketing",
        "type": "master",
        "label": "CoMarketing_Master_Pipeline"
      },
      {
        "id": "tpp_master",
        "stream": "TPP",
        "type": "master",
        "label": "TPP_Master_Pipeline"
      },
      {
        "id": "tpp_b",
        "stream": "TPP",
        "type": "bronze",
        "label": "TPP_Bronze"
      },
      {
        "id": "tpp_s",
        "stream": "TPP",
        "type": "silver",
        "label": "TPP_Silver"
      },
      {
        "id": "tpp_g",
        "stream": "TPP",
        "type": "gold",
        "label": "TPP_Gold"
      },
      {
        "id": "tpp_p",
        "stream": "TPP",
        "type": "publish",
        "label": "TPP_Publish_Pipeline"
      },
      {
        "id": "tpp_master2",
        "stream": "TPP",
        "type": "dead",
        "label": "TPP_Master_Refreshed (DUP?)"
      },
      {
        "id": "mpr_master",
        "stream": "Majors",
        "type": "master",
        "label": "MPR_Master_Pipeline_V2"
      },
      {
        "id": "mpr_b",
        "stream": "Majors",
        "type": "bronze",
        "label": "MPR_Bronze"
      },
      {
        "id": "mpr_s",
        "stream": "Majors",
        "type": "silver",
        "label": "MPR_Silver"
      },
      {
        "id": "mpr_g",
        "stream": "Majors",
        "type": "gold",
        "label": "MPR_Gold"
      },
      {
        "id": "mpr_p",
        "stream": "Majors",
        "type": "publish",
        "label": "MPR_Publish_Pipeline"
      },
      {
        "id": "rc_master",
        "stream": "RedCarpet",
        "type": "master",
        "label": "CoSell_RedCarpet_Master_Pipeline"
      },
      {
        "id": "rc_s",
        "stream": "RedCarpet",
        "type": "silver",
        "label": "RedCarpet_Silver_Pipeline"
      },
      {
        "id": "rc_g",
        "stream": "RedCarpet",
        "type": "gold",
        "label": "RedCarpet_Gold_Pipeline"
      },
      {
        "id": "rc_p",
        "stream": "RedCarpet",
        "type": "publish",
        "label": "RedCarpet_Publish_Pipeline"
      },
      {
        "id": "rc_master2",
        "stream": "RedCarpet",
        "type": "dead",
        "label": "RedCarpet_Master_Full_Refresh (DUP?)"
      },
      {
        "id": "dracr_master",
        "stream": "DRACR",
        "type": "master",
        "label": "DRACR_Pipeline"
      },
      {
        "id": "mhr_master",
        "stream": "Planning",
        "type": "master",
        "label": "MHR_Planning_Pipeline"
      },
      {
        "id": "pracr_master",
        "stream": "PRACFlow",
        "type": "master",
        "label": "PRACR_Master"
      },
      {
        "id": "pracr_files",
        "stream": "PRACFlow",
        "type": "bronze",
        "label": "PRACR_ProcessPartnerFiles"
      },
      {
        "id": "pracr_snap",
        "stream": "PRACFlow",
        "type": "gold",
        "label": "PRACR_Snapshot"
      },
      {
        "id": "pracr_email",
        "stream": "PRACFlow",
        "type": "ext",
        "label": "PRACR_Trigger_Email"
      }
    ],
    "edges": [
      {
        "from": "cfg",
        "to": "cs_master"
      },
      {
        "from": "cs_master",
        "to": "cs_status"
      },
      {
        "from": "cs_status",
        "to": "cs_init",
        "label": "StatusFlag 1|3"
      },
      {
        "from": "cs_init",
        "to": "cs_bronze"
      },
      {
        "from": "cs_bronze",
        "to": "cs_bval"
      },
      {
        "from": "cs_bval",
        "to": "cs_powerapp"
      },
      {
        "from": "cs_powerapp",
        "to": "cs_silver"
      },
      {
        "from": "cs_silver",
        "to": "cs_sval"
      },
      {
        "from": "cs_sval",
        "to": "cs_goldv1"
      },
      {
        "from": "cs_goldv1",
        "to": "cs_goldv2"
      },
      {
        "from": "cs_goldv2",
        "to": "cs_goldval"
      },
      {
        "from": "cs_goldval",
        "to": "cs_publish"
      },
      {
        "from": "ps_master",
        "to": "ps_gold"
      },
      {
        "from": "cfg",
        "to": "cm_master"
      },
      {
        "from": "cfg",
        "to": "tpp_master"
      },
      {
        "from": "tpp_master",
        "to": "tpp_b"
      },
      {
        "from": "tpp_b",
        "to": "tpp_s"
      },
      {
        "from": "tpp_s",
        "to": "tpp_g"
      },
      {
        "from": "tpp_g",
        "to": "tpp_p"
      },
      {
        "from": "cfg",
        "to": "mpr_master"
      },
      {
        "from": "mpr_master",
        "to": "mpr_b"
      },
      {
        "from": "mpr_b",
        "to": "mpr_s"
      },
      {
        "from": "mpr_s",
        "to": "mpr_g"
      },
      {
        "from": "mpr_g",
        "to": "mpr_p"
      },
      {
        "from": "cfg",
        "to": "rc_master"
      },
      {
        "from": "rc_master",
        "to": "rc_s"
      },
      {
        "from": "rc_s",
        "to": "rc_g"
      },
      {
        "from": "rc_g",
        "to": "rc_p"
      },
      {
        "from": "cfg",
        "to": "dracr_master"
      },
      {
        "from": "cfg",
        "to": "mhr_master"
      },
      {
        "from": "cfg",
        "to": "pracr_master"
      },
      {
        "from": "pracr_master",
        "to": "pracr_files"
      },
      {
        "from": "pracr_files",
        "to": "pracr_snap"
      },
      {
        "from": "pracr_snap",
        "to": "pracr_email"
      }
    ]
  }
};
