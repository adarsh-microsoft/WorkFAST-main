$f = "c:\Users\v-adevashish\AppData\Roaming\Code\User\workspaceStorage\f80fccdc8f3dba950386632b8d809d58\GitHub.copilot-chat\chat-session-resources\6fb9b9fd-2bc7-40e5-9898-dee557b4bb8f\toolu_01FoMH38wAGHSVyiY9aoBXjR__vscode-1780989224111\content.txt"
$len = (Get-Item $f).Length
"File bytes: $len  (= $([math]::Round($len/1MB,4)) MB)"
$fs = [System.IO.File]::OpenRead($f); $fs.Seek(-220,'End') | Out-Null
$buf = New-Object byte[] 220; [void]$fs.Read($buf,0,220); $fs.Close()
"TAIL: " + [System.Text.Encoding]::UTF8.GetString($buf)
