window.FACTS = {
  "generated": "2026-06-09T15:52:41",
  "count": 59,
  "records": [
    {
      "name": "Cosell_Gold_FactMarketplaceBilledSales",
      "writes": [
        "FactMarketplaceBilledSales",
        "DistinctMPNID",
        "MapMBS",
        "FactPartnerMBS",
        "FactCommercialMBS",
        "FactMarketPlaceBilledSalesReporting",
        "DistinctSubsidiaryID",
        "DistinctTPID"
      ],
      "reads": [
        {
          "t": "FactMarketplaceInvoice",
          "l": "Silver"
        },
        {
          "t": "DimInvoice",
          "l": "Gold"
        },
        {
          "t": "DimMarketplaceOffer",
          "l": "Gold"
        },
        {
          "t": "DimMSXCustomer",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "CustomerHQAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimRevenueAccount",
          "l": "Silver"
        },
        {
          "t": "DimEngagementMilestone_int",
          "l": "Gold"
        },
        {
          "t": "DimReportingPartnerOneSub",
          "l": "Gold"
        },
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "PartnerMaster",
          "l": "Bronze"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "VWDimGeography",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomTime",
          "l": "Silver"
        },
        {
          "t": "DimFirstDatePartition",
          "l": "Silver"
        },
        {
          "t": "DimOrganizationSubSegment",
          "l": "Silver"
        },
        {
          "t": "FieldGeographyDefinition",
          "l": "Silver"
        },
        {
          "t": "DimFieldGeography",
          "l": "Silver"
        },
        {
          "t": "DimAccountGeographyHierarchy_RoB",
          "l": "Silver"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimCustomGeography",
          "l": "Silver"
        },
        {
          "t": "FactMarketplaceBilledSales",
          "l": "Gold"
        },
        {
          "t": "DimFirstDatePartition",
          "l": "Silver"
        },
        {
          "t": "DimSalesCustomer",
          "l": "Silver"
        },
        {
          "t": "DimSalesGroup",
          "l": "Silver"
        }
      ],
      "tmp": 2,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|2 tmp/vw temp views: Silver_vw_dimgeography, TPAccountIDToATUDim_FPD_tmp",
        "NIT|1 print() statement(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactAccountPin",
      "writes": [
        "FactAccountPIN"
      ],
      "reads": [
        {
          "t": "PartnerImpactNumber",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeography",
          "l": "Silver"
        },
        {
          "t": "ManagedPractice_Full",
          "l": "Silver"
        },
        {
          "t": "DimPartnerOne",
          "l": "Gold"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimGPSCRMAccount",
          "l": "Gold"
        },
        {
          "t": "DimPINMetric",
          "l": "Gold"
        },
        {
          "t": "DimGPSBusinessUnit",
          "l": "Gold"
        },
        {
          "t": "MapAccountTag",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "PASS",
      "findings": [],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal_FY22",
      "writes": [
        "Gold_FactPartnerDeal_FY22"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimSellerCoSellIncentive",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDealSolutionHistory",
          "l": "Gold"
        },
        {
          "t": "DimIPPartner",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "PartnerDealFY22_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|1 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactIPCoSellTransition",
      "writes": [
        "FactIPCoSellTransition",
        "FactIPCoSellTransitionActuals_Partner",
        "FactIPCoSellTransitionActuals"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimMSXCustomer",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "PartnerMaster",
          "l": "Bronze"
        },
        {
          "t": "DimCustomTime",
          "l": "Silver"
        },
        {
          "t": "DimCustomGeography",
          "l": "Silver"
        },
        {
          "t": "DimFirstDatePartition",
          "l": "Silver"
        },
        {
          "t": "DimAccountGeographyHierarchy_RoB",
          "l": "Silver"
        },
        {
          "t": "FieldGeographyDefinition",
          "l": "Silver"
        },
        {
          "t": "DimFieldGeography",
          "l": "Silver"
        },
        {
          "t": "DimOrganizationSubSegment",
          "l": "Silver"
        },
        {
          "t": "DimSalesCustomer",
          "l": "Silver"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "FactIPCoSellTransition",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "NIT",
      "findings": [
        "NIT|2 print() statement(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactAHRFeedAudit",
      "writes": [
        "AHRFeed_Audit"
      ],
      "reads": [
        {
          "t": "DimSalesGeography",
          "l": "Silver"
        },
        {
          "t": "PartnerMaster",
          "l": "Bronze"
        },
        {
          "t": "Account",
          "l": "Silver"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimMSXCustomer",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "DimCRMPartnerAccount",
          "l": "Gold"
        },
        {
          "t": "PipelinePartnerMaster",
          "l": "Gold"
        },
        {
          "t": "DimGPSCRMAccount",
          "l": "Gold"
        },
        {
          "t": "PartnerDealSolution_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 9,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|9 tmp/vw temp views: DimGeography_ahrft_tmp, FactPartnerDeal_tmp_ahrf, AHRData_ahrft_tmp, PartnerOneSubID_ahrft_tmp_intermediate, PartnerOneSubID_ahrft_tmp, IPPartnerOneSubID_ahrft_tmp, PartnerTPID_ahrft_tmp, OneToMany_RowNumber_ahrft_tmp, OneToMany_Resolved_ahrft_tmp"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactCSPSolutionConsumptionOpportunity",
      "writes": [
        "FactCSPSolutionConsumptionOpportunity"
      ],
      "reads": [
        {
          "t": "Opportunity_Internal",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        },
        {
          "t": "DimMSXWorkLoad",
          "l": "Gold"
        },
        {
          "t": "CSPSolutionInternal",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|4 commented-out SQL column(s)",
        "WARN|OCP occurrence x3 (item 16)"
      ],
      "src": "parsed"
    },
    {
      "name": "FactMSXCombined",
      "writes": [
        "FactMSXCombined"
      ],
      "reads": [
        {
          "t": "DimOpportunityReporting",
          "l": "Gold"
        },
        {
          "t": "DimSharingType",
          "l": "Gold"
        },
        {
          "t": "FactOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimPartnerReferralReporting",
          "l": "Gold"
        },
        {
          "t": "FactPartnerReferralReporting",
          "l": "Gold"
        },
        {
          "t": "DimProductHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimRevSumHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimSolutionArea",
          "l": "Silver"
        },
        {
          "t": "DimSolutionAreaDetailReporting",
          "l": "Gold"
        },
        {
          "t": "DimProduct",
          "l": "Silver"
        },
        {
          "t": "DimSalesPlayReporting",
          "l": "Gold"
        },
        {
          "t": "DimEngagementMilestoneReporting",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimFiscalMonth",
          "l": "Silver"
        },
        {
          "t": "DimManagedTPAccount",
          "l": "Silver"
        },
        {
          "t": "DimSegmentHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimWorkload",
          "l": "Silver"
        },
        {
          "t": "FactMSXPartnerSharing",
          "l": "Gold"
        },
        {
          "t": "DimCustomSellerManagerWorkloadsMaster",
          "l": "Silver"
        },
        {
          "t": "DimCustomFieldSolutionAreaMapping",
          "l": "Silver"
        }
      ],
      "tmp": 2,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|2 tmp/vw temp views: Tmp_FilteredPartnerDeal, Tmp_MapOpptyCustomDealDirection"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactAccount",
      "writes": [
        "Gold_FactAccount"
      ],
      "reads": [
        {
          "t": "PartnerImpactNumber",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeography",
          "l": "Silver"
        },
        {
          "t": "Account",
          "l": "Silver"
        },
        {
          "t": "DimPartnerOne",
          "l": "Gold"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimGPSCRMAccount",
          "l": "Gold"
        },
        {
          "t": "DimEngagement",
          "l": "Gold"
        },
        {
          "t": "DimGPSBusinessUnit",
          "l": "Gold"
        },
        {
          "t": "DimLifecycleStage",
          "l": "Gold"
        },
        {
          "t": "MapAccountTag",
          "l": "Gold"
        },
        {
          "t": "DimCapacityGeography",
          "l": "Gold"
        },
        {
          "t": "DimSolutionEngagementPipeline",
          "l": "Gold"
        },
        {
          "t": "OcpTechServiceRequest",
          "l": "Silver"
        },
        {
          "t": "OcpCampaign",
          "l": "Silver"
        },
        {
          "t": "DimEngagementTagsHidden",
          "l": "Gold"
        },
        {
          "t": "DimReportingPartnerOneSub",
          "l": "Gold"
        },
        {
          "t": "DimRecruitLead",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|10 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactCSPSolutionBilledOpportunity",
      "writes": [
        "FactCSPSolutionBilledOpportunity"
      ],
      "reads": [
        {
          "t": "Opportunity_Internal",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        },
        {
          "t": "DimMSXSolutionArea",
          "l": "Gold"
        },
        {
          "t": "Opportunity_Internal",
          "l": "Gold"
        },
        {
          "t": "CSPSolutionInternal",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|4 commented-out SQL column(s)",
        "WARN|OCP occurrence x3 (item 16)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactCSPSolutionPartnerDeal",
      "writes": [
        "FactCSPSolutionPartnerDeal"
      ],
      "reads": [
        {
          "t": "CSPSolutionInternal",
          "l": "Gold"
        },
        {
          "t": "PCDeal_Internal",
          "l": "Gold"
        },
        {
          "t": "PSCDeal_Internal",
          "l": "Gold"
        },
        {
          "t": "MapPartnerDealSolutionNameBasedMapping",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|14 commented-out SQL column(s)",
        "WARN|OCP occurrence x3 (item 16)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactPartnerReferralReporting",
      "writes": [
        "FactPartnerReferralReporting"
      ],
      "reads": [
        {
          "t": "DimPartnerReferralReporting",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity",
          "l": "Gold"
        },
        {
          "t": "FactOpportunity",
          "l": "Gold"
        },
        {
          "t": "PS_DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimSharingType",
          "l": "Gold"
        },
        {
          "t": "DimSegmentHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimSalesDate",
          "l": "Silver"
        },
        {
          "t": "DimFiscalMonth",
          "l": "Silver"
        },
        {
          "t": "Associated_DimPartnerReferral",
          "l": "Gold"
        }
      ],
      "tmp": 2,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|2 tmp/vw temp views: Tmp_FilteredOppty, Tmp_MapCustomPartnerDealDirection"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal",
      "writes": [
        "FactPartnerDeal"
      ],
      "reads": [
        {
          "t": "MapSolutionPracticeIndustryCountry",
          "l": "Gold"
        },
        {
          "t": "DimSellerCoSellIncentive",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDealSolutionHistory",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "PartnerDealSolution_Snapshot",
          "l": "Gold"
        },
        {
          "t": "PartnerMaster",
          "l": "Bronze"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "Bridge_CascadedPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimPartner",
          "l": "Silver"
        },
        {
          "t": "FactSolution",
          "l": "Gold"
        },
        {
          "t": "DimChannelPartner",
          "l": "Gold"
        },
        {
          "t": "SellerCoSellIncentiveSolution",
          "l": "Gold"
        },
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimISVConnectApp",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactIPCoSell",
          "l": "Gold"
        },
        {
          "t": "DimIPPartner",
          "l": "Gold"
        },
        {
          "t": "DimIPCosell",
          "l": "Gold"
        },
        {
          "t": "DimIPCoSell_D365",
          "l": "Gold"
        },
        {
          "t": "MarketplaceDealsACV_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 5,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|5 tmp/vw temp views: tmp_MPNPartner_tdi, tmp_IPPartner, HasD365IncentiveType_fpdi_tmp, tmp_SnapshotIPPartnerOne, tmp_IPPartnerOneReporting",
        "WARN|6 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactOpportunityReporting",
      "writes": [
        "FactOpportunityReporting"
      ],
      "reads": [
        {
          "t": "DimOpportunityReporting",
          "l": "Gold"
        },
        {
          "t": "DimSharingType",
          "l": "Gold"
        },
        {
          "t": "FactOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimPartnerReferralReporting",
          "l": "Gold"
        },
        {
          "t": "FactPartnerReferralReporting",
          "l": "Gold"
        },
        {
          "t": "FactMSXPartnerSharing",
          "l": "Gold"
        },
        {
          "t": "DimProductHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimRevSumHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimSolutionArea",
          "l": "Silver"
        },
        {
          "t": "DimSolutionAreaDetailReporting",
          "l": "Gold"
        },
        {
          "t": "DimProduct",
          "l": "Silver"
        },
        {
          "t": "DimSalesPlayReporting",
          "l": "Gold"
        },
        {
          "t": "MapOpportunitySolution",
          "l": "Gold"
        },
        {
          "t": "DimCustomPartnerDealDirectionReporting",
          "l": "Gold"
        }
      ],
      "tmp": 4,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|4 tmp/vw temp views: Tmp_FilteredPartnerDeal, Tmp_MapOpptyCustomDealDirection, Tmp_FactOpportunityReporting, Tmp_Calculated_Columns"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactSolution",
      "writes": [
        "Gold_FactSolution"
      ],
      "reads": [
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "DimIndustry",
          "l": "Gold"
        },
        {
          "t": "SolutionIndustryAssociation",
          "l": "Silver"
        },
        {
          "t": "OcpCampaign",
          "l": "Silver"
        },
        {
          "t": "OcpTechServiceRequest",
          "l": "Silver"
        },
        {
          "t": "BuildWithEngagement",
          "l": "Silver"
        },
        {
          "t": "MapSolutionPractice",
          "l": "Gold"
        },
        {
          "t": "MapIndustrySolution",
          "l": "Gold"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "DimPartnerOne",
          "l": "Gold"
        },
        {
          "t": "FactLessSolutionEngagement",
          "l": "Gold"
        },
        {
          "t": "DimSellerCoSellIncentive",
          "l": "Gold"
        },
        {
          "t": "DimEngagementTagsHidden",
          "l": "Gold"
        },
        {
          "t": "MapPartnerOneAccountTag",
          "l": "Gold"
        },
        {
          "t": "MapSolutionEngagement",
          "l": "Gold"
        },
        {
          "t": "DimEngagement",
          "l": "Gold"
        },
        {
          "t": "DimISVConnectApp",
          "l": "Gold"
        },
        {
          "t": "SellerCoSellIncentiveSolution",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        },
        {
          "t": "DimSolutionArea",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|8 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactEngagementMilestoneReporting",
      "writes": [
        "FactEngagementMilestoneReporting"
      ],
      "reads": [
        {
          "t": "goldint_FactEngagementMilestone",
          "l": "Gold"
        },
        {
          "t": "DimEngagementMilestoneReporting",
          "l": "Gold"
        },
        {
          "t": "DimSharingType",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity",
          "l": "Gold"
        },
        {
          "t": "FactOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimOpportunityReporting",
          "l": "Gold"
        },
        {
          "t": "FactOpportunityReporting",
          "l": "Gold"
        },
        {
          "t": "DimFiscalMonth",
          "l": "Silver"
        },
        {
          "t": "DimManagedTPAccount",
          "l": "Silver"
        },
        {
          "t": "DimSegmentHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimWorkload",
          "l": "Silver"
        },
        {
          "t": "DimSolutionAreaDetailReporting",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        }
      ],
      "tmp": 2,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|2 tmp/vw temp views: Tmp_MilestoneCSPPartner, Tmp_MapOpptyCustomDealDirection"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactEngagementMilestone",
      "writes": [
        "goldint_FactEngagementMilestone",
        "FactEngagementMilestone"
      ],
      "reads": [
        {
          "t": "DimEngagementMilestone_int",
          "l": "Gold"
        },
        {
          "t": "FactEngagementMilestone",
          "l": "Silver"
        },
        {
          "t": "Hub_vw_Currency",
          "l": "Silver"
        },
        {
          "t": "FactOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "FactPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimSharingType",
          "l": "Gold"
        },
        {
          "t": "FactOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimCRMPartnerAccount",
          "l": "Gold"
        },
        {
          "t": "CustomerHQAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimReportingGeography",
          "l": "Silver"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "VWDimGeography",
          "l": "Silver"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "Bridge_CascadedPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimRevenueAccount",
          "l": "Silver"
        },
        {
          "t": "OpportunityDraftIntermediate",
          "l": "Gold"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimSolutionAreaOppty",
          "l": "Gold"
        },
        {
          "t": "DimMSXWorkLoad",
          "l": "Gold"
        },
        {
          "t": "goldint_FactEngagementMilestone",
          "l": "Gold"
        }
      ],
      "tmp": 2,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|2 tmp/vw temp views: Silver_Hub_vw_Currency, Silver_vw_dimgeography"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactSolutionPartnerDeal",
      "writes": [
        "FactSolutionPartnerDeal"
      ],
      "reads": [
        {
          "t": "PartnerDealSolutionNameBasedMapping",
          "l": "Gold"
        },
        {
          "t": "Solution_Internal",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "PSCDeal_Internal",
          "l": "Gold"
        },
        {
          "t": "PCDeal_Internal",
          "l": "Gold"
        },
        {
          "t": "MapPartnerDealSolutionNameBasedMapping",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|12 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactEngagementMilestonePipeline_int",
      "writes": [
        "FactEngagementMilestonePipeline_int"
      ],
      "reads": [
        {
          "t": "FactOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimEngagementMilestone",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "DimMSXCustomer",
          "l": "Gold"
        },
        {
          "t": "DimReportingGeography",
          "l": "Silver"
        }
      ],
      "tmp": 2,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|2 tmp/vw temp views: ACR_Pipeline_Base_tmp, ACR_Pipeline_tmp",
        "WARN|1 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactOpportunity",
      "writes": [
        "Fact_Opportunity_Pipeline_Base"
      ],
      "reads": [
        {
          "t": "SolutionArea",
          "l": "Silver"
        },
        {
          "t": "FactPipelineCurrent",
          "l": "Gold"
        },
        {
          "t": "DimAccountGeographyHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimAllAccounts",
          "l": "Silver"
        },
        {
          "t": "DimPricingLevelHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimReportedSubSegmentHierarchy",
          "l": "Silver"
        },
        {
          "t": "CustomerHQAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity",
          "l": "Silver"
        },
        {
          "t": "FactOpportunitiesSalesCycleDuration",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimRevenueAccount",
          "l": "Silver"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimProductHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimRevSumHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimLead",
          "l": "Gold"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "FactEngagementMilestone",
          "l": "Silver"
        },
        {
          "t": "FactEngagementMilestone",
          "l": "Silver"
        },
        {
          "t": "DimFiscalMonth",
          "l": "Silver"
        },
        {
          "t": "DimHC360Personnel",
          "l": "Gold"
        },
        {
          "t": "DimManagerList",
          "l": "Gold"
        },
        {
          "t": "DimReportingGeography",
          "l": "Silver"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "VWDimGeography",
          "l": "Silver"
        },
        {
          "t": "Bridge_CascadedPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimChannelManager",
          "l": "Gold"
        },
        {
          "t": "OpportunityDraftIntermediate",
          "l": "Gold"
        },
        {
          "t": "Hub_vw_Account",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeography",
          "l": "Silver"
        },
        {
          "t": "DimEngagementMilestone_int",
          "l": "Gold"
        },
        {
          "t": "Hub_vw_Currency",
          "l": "Silver"
        }
      ],
      "tmp": 6,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|6 tmp/vw temp views: Silver_Hub_vw_Account, Silver_Hub_vw_Currency, PipelineTMP, Tmp_AccountGeography_FO, Tmp_AccountSegment_FO, Fact_Opportunity_Pipeline_Base_tmp",
        "WARN|6 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactMSXPartnerSharing",
      "writes": [
        "dimpartnersharingexclusion_billedpipeline",
        "factmsxpartnersharing_stage1",
        "factmsxpartnersharing_stage2",
        "factmsxpartnersharing_stage3",
        "FactMSXPartnerSharing_Billed_tmp",
        "FactMSXPartnerSharing_Consumption_tmp",
        "FactMSXPartnerSharing"
      ],
      "reads": [
        {
          "t": "DimOpportunity",
          "l": "Silver"
        },
        {
          "t": "DimPricingLevelHierarchy",
          "l": "Bronze"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPipeline",
          "l": "Silver"
        },
        {
          "t": "DimProductHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimFiscalMonth",
          "l": "Silver"
        },
        {
          "t": "DimSalesDate",
          "l": "Silver"
        },
        {
          "t": "FactEngagementMilestone",
          "l": "Silver"
        },
        {
          "t": "DimEngagementMilestone",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "FactOpportunity",
          "l": "Gold"
        },
        {
          "t": "DimMSXCustomer",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "DimCRMPartnerAccount",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPracticeIndustryCountry",
          "l": "Gold"
        },
        {
          "t": "DimCapacityGeography",
          "l": "Gold"
        },
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimReportingPartnerOneSub",
          "l": "Gold"
        },
        {
          "t": "DimSolutionAreaOppty",
          "l": "Gold"
        },
        {
          "t": "DimRevSumDivision",
          "l": "Gold"
        },
        {
          "t": "DimMSXSolutionArea",
          "l": "Gold"
        },
        {
          "t": "DimMSXWorkLoad",
          "l": "Gold"
        },
        {
          "t": "Associated_DimPartnerReferral",
          "l": "Gold"
        },
        {
          "t": "dimpartnersharingexclusion_billedpipeline",
          "l": "Gold"
        },
        {
          "t": "factmsxpartnersharing_stage1",
          "l": "Gold"
        },
        {
          "t": "factmsxpartnersharing_stage2",
          "l": "Gold"
        },
        {
          "t": "factmsxpartnersharing_stage3",
          "l": "Gold"
        },
        {
          "t": "FactMSXPartnerSharing_Billed",
          "l": "Gold"
        },
        {
          "t": "FactMSXPartnerSharing_Consumption",
          "l": "Gold"
        }
      ],
      "tmp": 10,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|10 tmp/vw temp views: tmp_Oppty_Internal_DOCF, tmp_PrioritizedPartners_DOCF, tmp_IsOpptyAttachedFlagPopulation_DOCF, tmp_OpportunityTPID_DOCF, Tmp_OpportunityRevenue_MPS, Tmp_OpportunityRevenue_Final_MPS, FactMSXPartnerSharing_Billed_tmp, FactMSXPartnerSharing_Billed_tmp, FactMSXPartnerSharing_Consumption_tmp, FactMSXPartnerSharing_Consumption_tmp"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactIPCoSell",
      "writes": [
        "FactIPCoSell"
      ],
      "reads": [
        {
          "t": "FactPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "DimIPCosell",
          "l": "Gold"
        },
        {
          "t": "DimGPSCRMAccount",
          "l": "Gold"
        },
        {
          "t": "PartnerDealSolution_Snapshot",
          "l": "Gold"
        },
        {
          "t": "TrueACRPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "DimTopTierMonthlyStatus",
          "l": "Gold"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "PartnerMaster",
          "l": "Silver"
        },
        {
          "t": "DimMSXCustomer",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "MarketplaceDealsACV_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 7,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|7 tmp/vw temp views: ACR_excel_tmp_fipcs, IPCoSell_revcal_fipcs_tmp, ACR_fipcs_tmp, AHRFeed_pracr_no_fipcs_tmp, AHRFeed_pracr_yes_fipcs_tmp, AHRFeed_Split_fipcs_tmp, AHRData_fipcs_tmp",
        "WARN|2 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactSolutionConsumptionOpportunity",
      "writes": [
        "FactSolutionConsumptionOpportunity"
      ],
      "reads": [
        {
          "t": "DimMSXWorkLoad",
          "l": "Gold"
        },
        {
          "t": "Opportunity_Internal",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "DimEngagementMilestone_int",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        },
        {
          "t": "Solution_Internal",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|4 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactSolutionBilledOpportunity",
      "writes": [
        "FactSolutionBilledOpportunity"
      ],
      "reads": [
        {
          "t": "FactOpportunityProduct",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "FactOpportunityProduct_Internal",
          "l": "Gold"
        },
        {
          "t": "Opportunity_Internal",
          "l": "Gold"
        },
        {
          "t": "DimMSXSolutionArea",
          "l": "Gold"
        },
        {
          "t": "Solution_Internal",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        }
      ],
      "tmp": 1,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|1 tmp/vw temp views: Tmp_AllOpptyProduct_Internal",
        "WARN|4 commented-out SQL column(s)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactLead",
      "writes": [
        "FactLead"
      ],
      "reads": [
        {
          "t": "DimLead",
          "l": "Gold"
        },
        {
          "t": "VWDimGeography",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "FactLead_int",
          "l": "Silver"
        },
        {
          "t": "DimLead",
          "l": "Silver"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "DimAccountGeographyHierarchy",
          "l": "Silver"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCRMPartnerAccount",
          "l": "Gold"
        },
        {
          "t": "PipelinePartnerMaster",
          "l": "Gold"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimReportingGeography",
          "l": "Silver"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "Bridge_CascadedPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        }
      ],
      "tmp": 1,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|1 tmp/vw temp views: Silver_VWDimGeography"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactSolutionCapacityGeography",
      "writes": [
        "Gold_FactSolutionCapacityGeography"
      ],
      "reads": [
        {
          "t": "SellInCountryMapping",
          "l": "Silver"
        },
        {
          "t": "DimCapacityGeography",
          "l": "Gold"
        },
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "FactSolution",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPracticeIndustryCountry",
          "l": "Gold"
        },
        {
          "t": "DimEngagement",
          "l": "Gold"
        },
        {
          "t": "DimSolutionEngagementPipeline",
          "l": "Gold"
        },
        {
          "t": "MapPartnerOneAccountTag",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerOneReportingPartnerOneSubAccount",
          "l": "Gold"
        }
      ],
      "tmp": 1,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|1 tmp/vw temp views: Gold_SellInCountryMapping_Tmp_FSCG",
        "WARN|9 commented-out SQL column(s)",
        "WARN|OCP occurrence x2 (item 16)"
      ],
      "src": "parsed"
    },
    {
      "name": "Cosell_Gold_FactAzureConsumptionCTCG",
      "writes": [
        "FactAzureConsumptionCTCG"
      ],
      "reads": [
        {
          "t": "Map_Association_Partner_PPR",
          "l": "Silver"
        },
        {
          "t": "DimAzureAssociationType",
          "l": "Silver"
        },
        {
          "t": "FactAzureConsumption",
          "l": "Silver"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeoHierarchy",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|%%spark scala cells toggling autoBroadcastJoinThreshold",
        "WARN|near-duplicate of FactAzureConsumptionP1CGCT"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactAzureConsumptionP1CGCT",
      "writes": [
        "FactAzureConsumptionP1CGCT"
      ],
      "reads": [
        {
          "t": "Map_Association_Partner_PPR",
          "l": "Silver"
        },
        {
          "t": "DimAzureAssociationType",
          "l": "Silver"
        },
        {
          "t": "FactAzureConsumption",
          "l": "Silver"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeoHierarchy",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|near-duplicate of FactAzureConsumptionCTCG (adds PartnerOneReportingKey)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactCosellTargets",
      "writes": [
        "FactCoSellTargets"
      ],
      "reads": [
        {
          "t": "GeographySubsidiaryHierarchyDim",
          "l": "Gold"
        },
        {
          "t": "FactSubScorecardTargets",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|STUBBED: real CTE commented out, replaced with SELECT 0..0 AS Targets",
        "WARN|%%sql desc cell (item 7)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactCRMPartner",
      "writes": [
        "FactCRMPartner"
      ],
      "reads": [
        {
          "t": "DimPartner",
          "l": "Silver"
        },
        {
          "t": "PipelinePartnerMaster",
          "l": "Gold"
        },
        {
          "t": "DimCRMPartnerAccount",
          "l": "Gold"
        },
        {
          "t": "PartnerMaster",
          "l": "Silver"
        },
        {
          "t": "VWDimGeography",
          "l": "Silver"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        }
      ],
      "tmp": 1,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|tmp view Gold_DimPartnerOneSub_tmp (item 15)",
        "NIT|writeTable 1st arg 'Gold_FactCRMPartner' (Gold_ prefix)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactCRMUser",
      "writes": [
        "FactCRMUser"
      ],
      "reads": [
        {
          "t": "DimGPSBusinessUnit",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|BROKEN: Silver_CrmUser source commented out; final SQL references undefined alias CU (CU.BusinessUnit/CU.UserID) -> unresolved column at writeTable",
        "WARN|%%spark magic; many commented lines"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactEngagementMilestonePipeline",
      "writes": [
        "FactEngagementMilestonePipeline"
      ],
      "reads": [
        {
          "t": "FactEngagementMilestonePipeline_int",
          "l": "Gold"
        },
        {
          "t": "DimMSXWorkLoad",
          "l": "Gold"
        },
        {
          "t": "DimSolutionAreaOppty",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "PASS",
      "findings": [],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactFY20AllianceReadiness",
      "writes": [
        "FactFY20AllianceReadiness"
      ],
      "reads": [
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "vw_alliancereadiness",
          "l": "Silver"
        },
        {
          "t": "vw_certifications",
          "l": "Silver"
        },
        {
          "t": "DimCapacityGeography",
          "l": "Gold"
        },
        {
          "t": "DimSolutionArea",
          "l": "Gold"
        },
        {
          "t": "MapPartnerOneAccountTag",
          "l": "Gold"
        },
        {
          "t": "DimPartnerOne",
          "l": "Gold"
        },
        {
          "t": "Actual",
          "l": "Silver"
        }
      ],
      "tmp": 1,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|wrong Purpose header 'FinalActualAmount Table' (LE-10)",
        "WARN|tmp_AllCertified_FAR tmp view (item 15)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactInvoice",
      "writes": [
        "FactInvoice"
      ],
      "reads": [
        {
          "t": "FactMarketplaceInvoice",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "NIT",
      "findings": [
        "NIT|header Project Name 'Partner Programs' not Cosell",
        "NIT|passthrough/projection of one silver table"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactIOPO",
      "writes": [
        "FactIOPO"
      ],
      "reads": [
        {
          "t": "FinalActualAmount",
          "l": "Gold"
        },
        {
          "t": "FinalInvoiceAmount",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|SQL parse error: CTE_ActualFinal missing AS keyword (LE-02)",
        "WARN|dead CTE_InvoiceFinal defined but final SELECT uses CTE_Invoice (LE-11)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactISVConnect",
      "writes": [
        "FactISVConnect"
      ],
      "reads": [
        {
          "t": "FactISV",
          "l": "Silver"
        },
        {
          "t": "MapSolutionPractice",
          "l": "Gold"
        },
        {
          "t": "MapIndustrySolution",
          "l": "Gold"
        },
        {
          "t": "DimISVConnectApp",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|commented-out getDataframe + JOIN (MapSolutionEngagement) (LE-06)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactLessSolutionEngagement",
      "writes": [
        "FactLessSolutionEngagement"
      ],
      "reads": [
        {
          "t": "DimSolution",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|BROKEN: getDataframe for BuildWithEngagement + DimEngagement commented out but SQL references Silver_buildwithengagement + Gold_dimEngagement -> view not found (LE-06/LE-02)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactMarketPlaceOffer",
      "writes": [
        "FactMarketPlaceOffer"
      ],
      "reads": [
        {
          "t": "FactMarketplaceOffer",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "NIT",
      "findings": [
        "NIT|header Project Name 'Partner Programs'",
        "NIT|single-source passthrough"
      ],
      "src": "read"
    },
    {
      "name": "CoSell_Gold_FactMBSCommercialTargets",
      "writes": [
        "FactMBSCommercialTargets"
      ],
      "reads": [
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|STUBBED: real CTE commented out, replaced with SELECT 0..0 AS Targets",
        "WARN|hardcoded Excel 'FY24 MBS Co-Sell by PartnerOne.xlsx' (LE-03)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactMBSCommercialTargetsExcel",
      "writes": [
        "FactMBSCommercialTargetsExcel"
      ],
      "reads": [],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|duplicate fillna/select cells (copy-paste)",
        "WARN|hardcoded Excel 'FY24 MBS Co-Sell by PartnerOne.xlsx' (LE-03)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactMBSTargets",
      "writes": [
        "FactMBSTargets"
      ],
      "reads": [],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|STUBBED: real CTE commented out, replaced with SELECT 0..0 AS Targets",
        "WARN|commented code contains OCPStaging_CRM -> OCP occurrence (item 16)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactOpportunitiesSalesCycleDuration",
      "writes": [
        "FactOpportunitiesSalesCycleDuration"
      ],
      "reads": [
        {
          "t": "FactSalesStageVelocity",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|'NULL' string literals used as column values",
        "NIT|ORDER BY inside temp view (unnecessary)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactOpportunityProduct_Internal",
      "writes": [
        "FactOpportunityProduct_Internal"
      ],
      "reads": [
        {
          "t": "FactOpportunityProduct",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "NIT",
      "findings": [
        "NIT|Purpose 'FactOpportunity_Product'"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactOpportunityProduct",
      "writes": [
        "FactOpportunityProduct"
      ],
      "reads": [
        {
          "t": "DimProductPFam",
          "l": "Gold"
        },
        {
          "t": "FactPipeline",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|wrong Purpose header 'DimPartnerTDPIntent Table' (LE-10)",
        "NIT|Project Name 'Partner Programs'"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal_FY20",
      "writes": [
        "FactPartnerDeal_FY20"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimSellerCoSellIncentive",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDealSolutionHistory",
          "l": "Gold"
        },
        {
          "t": "DimIPPartner",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "PartnerDealFY20_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|column alias typo 'SolutionPartnerDealCompositeKe' (missing y) -> downstream column-name mismatch",
        "WARN|FY-shard duplicate (A-03)",
        "WARN|FP.Rank unescaped reserved word"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal_FY21",
      "writes": [
        "FactPartnerDeal_FY21"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimSellerCoSellIncentive",
          "l": "Gold"
        },
        {
          "t": "MapSolutionPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDealSolutionHistory",
          "l": "Gold"
        },
        {
          "t": "DimIPPartner",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "PartnerDealFY21_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|FY-shard duplicate (A-03)",
        "WARN|FP.Rank unescaped reserved word"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal_FY23",
      "writes": [
        "FactPartnerDeal_FY23"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "PartnerDealFY23_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|FY-shard duplicate (A-03)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal_FY24",
      "writes": [
        "FactPartnerDeal_FY24"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "PartnerDealFY24_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|FY-shard duplicate (A-03)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal_FY25",
      "writes": [
        "FactPartnerDeal_FY25"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "PartnerDealFY25_Snapshot",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|FY-shard duplicate (A-03)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerDealDuration",
      "writes": [
        "FactPartnerDealDuration"
      ],
      "reads": [
        {
          "t": "PartnerDealIntermediate",
          "l": "Gold"
        },
        {
          "t": "ReferralCycleTimeUnpivoted",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "PASS",
      "findings": [],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerOne",
      "writes": [
        "FactPartnerOne"
      ],
      "reads": [
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "FactSolution",
          "l": "Gold"
        },
        {
          "t": "DimSolution",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "MapPartnerOneAccountTag",
          "l": "Gold"
        }
      ],
      "tmp": 2,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|Gold_vw_ temp views (item 15)",
        "WARN|commented engagement logic (FactEngagement) (LE-06)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPRACRTargets",
      "writes": [
        "FactPRACRTargets"
      ],
      "reads": [
        {
          "t": "PRACRTargetsData",
          "l": "Silver"
        },
        {
          "t": "PRACRTargetsData_FY22",
          "l": "Silver"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "PASS",
      "findings": [],
      "src": "read"
    },
    {
      "name": "CoSell_Gold_FactProject",
      "writes": [
        "FactProject"
      ],
      "reads": [
        {
          "t": "Project",
          "l": "Silver"
        },
        {
          "t": "DimProjectTask",
          "l": "Gold"
        },
        {
          "t": "DimProjectDeliverables",
          "l": "Gold"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "PASS",
      "findings": [],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactRecruitISVTargets",
      "writes": [
        "FactRecruitISVTargets"
      ],
      "reads": [
        {
          "t": "DimGPSBusinessUnit",
          "l": "Gold"
        },
        {
          "t": "DimSalesGeography",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|hardcoded source 'stc_ISVTargets.csv' (LE-03)",
        "NIT|readexceltodf on a .csv"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_HC360PersonnelFact",
      "writes": [
        "FactHC360Personnel"
      ],
      "reads": [
        {
          "t": "GL04ProfitCenter",
          "l": "Silver"
        },
        {
          "t": "GL04CostCenter",
          "l": "Silver"
        },
        {
          "t": "GL04GeographyHierarchy",
          "l": "Silver"
        },
        {
          "t": "HC01HCActualSummary",
          "l": "Silver"
        },
        {
          "t": "DimFiscalMonth",
          "l": "Silver"
        },
        {
          "t": "DimPerson",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "NIT",
      "findings": [
        "NIT|notebook name HC360PersonnelFact vs table FactHC360Personnel (naming mismatch)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_PartnerDealFact",
      "writes": [
        "PartnerDealFact_int"
      ],
      "reads": [
        {
          "t": "FactPartnerDeal_SnapShot",
          "l": "Silver"
        },
        {
          "t": "DimPartnerDeal",
          "l": "Bronze"
        },
        {
          "t": "DimPartnerAccount",
          "l": "Silver"
        },
        {
          "t": "Hub_vw_Account",
          "l": "Silver"
        },
        {
          "t": "DimRevenueAccount",
          "l": "Silver"
        },
        {
          "t": "CustomerHQAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "HIGH",
      "findings": [
        "HIGH|wrong Purpose header 'DimPartnerTDPIntent Table' (LE-10)",
        "WARN|hardcoded magic opportunity IDs NOT IN ('7-PXA2FFZQZ','7-PXA2FF3HD') (LE-03)",
        "NIT|writes PartnerDealFact_int (name mismatch)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_PipelineFactCurrent",
      "writes": [
        "FactPipelineCurrent"
      ],
      "reads": [
        {
          "t": "FactPipeline",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|hardcoded magic opportunity IDs NOT IN ('7-PXA2FFZQZ','7-PXA2FF3HD') (LE-03)",
        "NIT|'NULL' string REPLACE pattern"
      ],
      "src": "read"
    },
    {
      "name": "PSA_Gold_FactAzureConsumptionP1",
      "writes": [
        "FactAzureConsumptionP1"
      ],
      "reads": [
        {
          "t": "MapAzureAssociationPartner",
          "l": "Silver"
        },
        {
          "t": "DimAssociationType",
          "l": "Silver"
        },
        {
          "t": "FactAzureConsumption",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeoHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimACRAdjustmentType",
          "l": "Silver"
        }
      ],
      "tmp": 0,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "WARN|4th AzureConsumption variant (CTCG/P1CGCT/P1/PSA_P1) heavy duplication",
        "NIT|temp view name contains 'OCP' substring (PPROCPMart)"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactOpportunity_int",
      "writes": [
        "FactOpportunity_int"
      ],
      "reads": [
        {
          "t": "FactPipelineCurrent",
          "l": "Gold"
        },
        {
          "t": "CustomerHQAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "FactPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "FactOpportunitiesSalesCycleDuration",
          "l": "Gold"
        },
        {
          "t": "TPAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimLead",
          "l": "Gold"
        },
        {
          "t": "DimHC360Personnel",
          "l": "Gold"
        },
        {
          "t": "DimManagerList",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "DimChannelManager",
          "l": "Gold"
        },
        {
          "t": "OpportunityDraftIntermediate",
          "l": "Gold"
        },
        {
          "t": "DimEngagementMilestone_int",
          "l": "Gold"
        },
        {
          "t": "SolutionArea",
          "l": "Silver"
        },
        {
          "t": "DimAccountGeographyHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimAllAccounts",
          "l": "Silver"
        },
        {
          "t": "DimPricingLevelHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimReportedSubSegmentHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity",
          "l": "Silver"
        },
        {
          "t": "DimRevenueAccount",
          "l": "Silver"
        },
        {
          "t": "DimProductHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimRevSumHierarchy",
          "l": "Silver"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "FactEngagementMilestone",
          "l": "Silver"
        },
        {
          "t": "DimFiscalMonth",
          "l": "Silver"
        },
        {
          "t": "DimReportingGeography",
          "l": "Silver"
        },
        {
          "t": "VWDimGeography",
          "l": "Silver"
        },
        {
          "t": "Bridge_CascadedPartnerOne",
          "l": "Silver"
        },
        {
          "t": "Hub_vw_Account",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeography",
          "l": "Silver"
        },
        {
          "t": "Hub_vw_Currency",
          "l": "Silver"
        }
      ],
      "tmp": 6,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "HIGH|most-connected fact: 33 upstream reads -> central hub, change-risk concentration",
        "WARN|6 tmp/vw temp views (Tmp_AccountGeography_FO, Tmp_AccountSegment_FO, Fact_Opportunity_Pipeline_Base_tmp, PipelineTMP) (item 15)",
        "WARN|writeTable 1st arg 'Fact_Opportunity_Pipeline_Base' != table name"
      ],
      "src": "read"
    },
    {
      "name": "Cosell_Gold_FactPartnerDeal_int",
      "writes": [
        "FactPartnerDeal_int"
      ],
      "reads": [
        {
          "t": "DimPartnerDeal_int",
          "l": "Gold"
        },
        {
          "t": "PartnerDealIntermediate",
          "l": "Gold"
        },
        {
          "t": "DimLead",
          "l": "Gold"
        },
        {
          "t": "DimPartnerOne",
          "l": "Gold"
        },
        {
          "t": "CustomerHQAccountsDim_int",
          "l": "Gold"
        },
        {
          "t": "DimCRMPartnerAccount",
          "l": "Gold"
        },
        {
          "t": "DimCustomerSegment",
          "l": "Gold"
        },
        {
          "t": "DimOpportunity_int",
          "l": "Gold"
        },
        {
          "t": "PipelinePartnerMaster",
          "l": "Gold"
        },
        {
          "t": "DimCustomerGeography",
          "l": "Gold"
        },
        {
          "t": "DimManagerList",
          "l": "Gold"
        },
        {
          "t": "DimScoreCardRecognitionTime",
          "l": "Gold"
        },
        {
          "t": "DimPartnerDealProfile",
          "l": "Gold"
        },
        {
          "t": "Hub_vw_Currency",
          "l": "Silver"
        },
        {
          "t": "Hub_vw_Account",
          "l": "Silver"
        },
        {
          "t": "DimSalesGeography",
          "l": "Silver"
        },
        {
          "t": "Currency",
          "l": "Silver"
        },
        {
          "t": "VWDimGeography",
          "l": "Silver"
        },
        {
          "t": "DimOpportunity",
          "l": "Silver"
        },
        {
          "t": "DimTime",
          "l": "Silver"
        },
        {
          "t": "PartnerMaster",
          "l": "Silver"
        },
        {
          "t": "DimRevenueAccount",
          "l": "Silver"
        },
        {
          "t": "ReportingPartnerOne",
          "l": "Silver"
        },
        {
          "t": "Bridge_CascadedPartnerOne",
          "l": "Silver"
        },
        {
          "t": "DimReportingGeography",
          "l": "Silver"
        },
        {
          "t": "PartnerMarketingProfilePII",
          "l": "Silver"
        }
      ],
      "tmp": 7,
      "ss": true,
      "se": true,
      "att": false,
      "verdict": "WARN",
      "findings": [
        "HIGH|core hub: produces the FactPartnerDeal gold table consumed by FY20-25 shards + FactPartnerOne + FactOpportunity_int",
        "WARN|7 tmp/vw temp views (tmp_PartnerOne_Mapping, TPAccountIDToATUDim_FPD_tmp, tmp_PartnerOneSub_Mapping, vw_date) (item 15)"
      ],
      "src": "read"
    }
  ]
};
