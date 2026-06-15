# Completes the inventory with artifacts that were returned inline (not via temp files)
$base = "c:\WorkFAST-main\Cosell-Master-Analysis"
$paths = [System.Collections.Generic.List[string]]::new()
Get-Content "$base\data\all-paths.txt" | ForEach-Object { $paths.Add($_) }

# Cosell core pipelines (returned inline earlier)
$coreP = @(
'/Fabric/Cosell/Pipelines/CoSell_Bronze_Pipeline.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Bronze_Validate.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Gold_Pipeline.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Gold_Pipeline_V4.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Gold_Validation.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Master_Pipeline.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Publish_Schema_Pipeline.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Silver_Pipeline.DataPipeline',
'/Fabric/Cosell/Pipelines/CoSell_Silver_Validate.DataPipeline',
'/Fabric/Cosell/Pipelines/Cosell_Gold_Pipeline_V3.DataPipeline',
'/Fabric/Cosell/Pipelines/Cosell_Reset_Flag.DataPipeline',
'/Fabric/Cosell/Pipelines/Gold_Pipeline_V2.DataPipeline',
'/Fabric/Cosell/Pipelines/PartnerSharing_Gold_Pipeline.DataPipeline',
'/Fabric/Cosell/Pipelines/PartnerSharing_Master_Pipeline.DataPipeline',
'/Fabric/Cosell/Pipelines/SilverNotebooks.DataPipeline',
'/Fabric/CoMarketing/Pipeline/CoMarketing_Master_Pipeline.DataPipeline',
'/Fabric/PRACFlow/Pipeline/PRACR_Master.DataPipeline',
'/Fabric/PRACFlow/Pipeline/PRACR_ProcessPartnerFiles.DataPipeline',
'/Fabric/PRACFlow/Pipeline/PRACR_Snapshot.DataPipeline',
'/Fabric/PRACFlow/Pipeline/PRACR_Trigger_Email.DataPipeline'
)
foreach ($x in $coreP) { if ($paths -notcontains $x) { $paths.Add($x) } }

# Semantic models
$models = @('CoMarketingModel','CoSellSemanticModel','MRoB Model','PSA_Impact_Dataset','Partner Planning and Transition Dataset','PartnerSharingModel','TPP_Dataset_Model','UsageMetricReport','majorsSemanticModel')
foreach ($m in $models) { $paths.Add("/Model/$m.bim") }

# Reports
$reports = @('Co-Marketing Performance Dashboard','GPS Insights Hub - Sell-With - Referral and Co-Sell','GPS Insights Hub - Sell-With - Solution Performance','GPS SingleMPN Sell With','IP Co-sell','MPR Dashboard','MSX Insights - Partner Sharing HBI - Strictly Confidential - Specialist','MSX Insights - Partner Sharing HBI - Strictly Confidential','PDM Pipeline Insights','PSA Impact Reporting','Partner Planning and Transition','Pipeline Flow Execution','Power 5','Services Co-sell Dashboard')
foreach ($r in $reports) { $paths.Add("/Reports/$r.pbix") }

$final = $paths | Select-Object -Unique | Sort-Object
$final | Set-Content "$base\data\all-paths.txt" -Encoding UTF8

$nb = $final | Where-Object { $_ -match '\.Notebook$' }
$dp = $final | Where-Object { $_ -match '\.DataPipeline$' }
"FINAL INVENTORY"
"Notebooks    : $($nb.Count)"
"DataPipelines: $($dp.Count)"
"Models       : $(($final | Where-Object { $_ -match '\.bim$' }).Count)"
"Reports      : $(($final | Where-Object { $_ -match '\.pbix$' }).Count)"
"Total paths  : $($final.Count)"
