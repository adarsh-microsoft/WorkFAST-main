$root = 'c:\WorkFAST-main\ldp-courses\BA-PE107-power-bi-embedded\PowerBIEmbed_adarshd'
$out  = 'c:\WorkFAST-main\ldp-courses\BA-PE107-power-bi-embedded\deliverables'
Set-Location $root
Remove-Item bin,obj -Recurse -Force -ErrorAction SilentlyContinue
for ($i = 1; $i -le 5; $i++) {
  $z = Join-Path $out "PS${i}_adarshd.zip"
  Remove-Item $z -Force -ErrorAction SilentlyContinue
  Compress-Archive -Path "$root\*" -DestinationPath $z -Force
}
Get-ChildItem $out | Select-Object Name, @{n='MB';e={[math]::Round($_.Length/1MB,2)}}
