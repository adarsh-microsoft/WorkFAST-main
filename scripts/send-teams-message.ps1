param(
    [Parameter(Mandatory=$true)][string]$Recipient,
    [Parameter(Mandatory=$true)][string]$Message
)

$flowUrl = "https://839eace659ab424397eca5b8fcc104.e4.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/eeebec37afb34f0a9d964630139780c1/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4LmpDjCI2HaJus8bJCHrasvCTHRfxUmkjaMqVQJLCkk"

$body = @{ recipient = $Recipient; message = $Message } | ConvertTo-Json -Compress

try {
    $r = Invoke-WebRequest -Uri $flowUrl -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "Sent to $Recipient : $Message (Status: $($r.StatusCode))"
} catch {
    Write-Error "Failed to send: $_"
    exit 1
}
