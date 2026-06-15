# Captures Chrome window with DevTools open for each PS variant.
# Uses Win32 to find the window by title and force-foreground before capture.
param(
  [string]$HtmlPath = "$PSScriptRoot\mock-embed.html",
  [string]$OutDir = "$PSScriptRoot\..\PowerBIEmbed_adarshd\screenshots"
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$sig = @'
using System;
using System.Runtime.InteropServices;
using System.Text;

public class Win32 {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)]
  public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

  [StructLayout(LayoutKind.Sequential)]
  public struct RECT { public int Left, Top, Right, Bottom; }

  public static System.Collections.Generic.List<IntPtr> FindByTitle(string match) {
    var list = new System.Collections.Generic.List<IntPtr>();
    EnumWindows((h, l) => {
      if (!IsWindowVisible(h)) return true;
      int len = GetWindowTextLength(h);
      if (len == 0) return true;
      var sb = new StringBuilder(len + 1);
      GetWindowText(h, sb, sb.Capacity);
      if (sb.ToString().IndexOf(match, StringComparison.OrdinalIgnoreCase) >= 0) list.Add(h);
      return true;
    }, IntPtr.Zero);
    return list;
  }
}
'@
if (-not ('Win32' -as [type])) { Add-Type -TypeDefinition $sig -Language CSharp }

$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$prof = Join-Path $env:TEMP 'pbi-cap-profile'
if (Test-Path $prof) { Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory $prof -Force | Out-Null

$abs = (Resolve-Path $HtmlPath).Path
$fileUrl = 'file:///' + ($abs -replace '\\','/')

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory $OutDir -Force | Out-Null }

function Capture-Window([string]$urlSuffix, [string]$outName) {
  $url = "$fileUrl`?ps=$urlSuffix"
  Write-Host "Launching Chrome for $urlSuffix -> $outName"
  $args = @(
    '--user-data-dir=' + $prof,
    '--no-first-run',
    '--no-default-browser-check',
    '--auto-open-devtools-for-tabs',
    '--window-position=0,0',
    '--window-size=1400,900',
    '--new-window',
    $url
  )
  $proc = Start-Process -FilePath $chrome -ArgumentList $args -PassThru
  Start-Sleep -Seconds 6  # let page load fully

  $hwnd = [IntPtr]::Zero
  for ($i = 0; $i -lt 15; $i++) {
    $found = [Win32]::FindByTitle("PowerBIEmbed_adarshd")
    if ($found.Count -gt 0) { $hwnd = $found[0]; break }
    Start-Sleep -Milliseconds 700
  }

  if ($hwnd -eq [IntPtr]::Zero) {
    Write-Warning "Window not found by title"
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
  } else {
    [void][Win32]::ShowWindow($hwnd, 9)  # SW_RESTORE
    [void][Win32]::MoveWindow($hwnd, 0, 0, 1400, 900, $true)
    [void][Win32]::SetForegroundWindow($hwnd)
    Start-Sleep -Milliseconds 800
    # Force-open DevTools via F12 (in case auto-open flag didn't take effect)
    [System.Windows.Forms.SendKeys]::SendWait('{F12}')
    Start-Sleep -Seconds 4  # DevTools opens + page console logs visible
    [void][Win32]::SetForegroundWindow($hwnd)
    Start-Sleep -Milliseconds 500
    $r = New-Object Win32+RECT
    [void][Win32]::GetWindowRect($hwnd, [ref]$r)
    $bounds = New-Object System.Drawing.Rectangle $r.Left, $r.Top, ($r.Right - $r.Left), ($r.Bottom - $r.Top)
  }
  Write-Host ("Capturing bounds: {0},{1} {2}x{3}" -f $bounds.X, $bounds.Y, $bounds.Width, $bounds.Height)

  $bmp = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
  $out = Join-Path $OutDir $outName
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Host "Saved $out"

  try { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } catch {}
  Get-CimInstance Win32_Process -Filter "CommandLine LIKE '%pbi-cap-profile%'" -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 2
}

Capture-Window 'ps3' 'ps3-console.png'
Capture-Window 'ps4' 'ps4-console.png'
Capture-Window 'ps5' 'ps5-console.png'

Get-CimInstance Win32_Process -Filter "CommandLine LIKE '%pbi-cap-profile%'" -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Write-Host "DONE"
