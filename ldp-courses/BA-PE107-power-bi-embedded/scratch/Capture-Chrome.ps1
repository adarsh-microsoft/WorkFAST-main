# Capture-Chrome.ps1
# Finds a Chrome window whose title matches the given pattern, ensures DevTools is open (F12 toggle),
# triggers a reload or click if requested, and saves a PNG using PrintWindow with PW_RENDERFULLCONTENT.
# PrintWindow flag 0x00000002 (PW_RENDERFULLCONTENT) was added in Win8.1 to support Chromium/Electron.

param(
  [Parameter(Mandatory=$true)][string]$TitleMatch,
  [Parameter(Mandatory=$true)][string]$OutFile,
  [switch]$ToggleDevTools,
  [switch]$Reload,
  [switch]$ScrollConsoleTop,
  [switch]$ScrollConsoleBottom,
  [int]$WaitMs = 1500
)

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class W32 {
  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc proc, IntPtr lParam);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT r);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr hWnd, IntPtr hdc, uint flags);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int cmd);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
  [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint t1, uint t2, bool attach);
  [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

$found = @()
$cb = [W32+EnumWindowsProc]{
  param($h, $l)
  if (-not [W32]::IsWindowVisible($h)) { return $true }
  $len = [W32]::GetWindowTextLength($h)
  if ($len -le 0) { return $true }
  $sb = New-Object System.Text.StringBuilder ($len + 2)
  [W32]::GetWindowText($h, $sb, $sb.Capacity) | Out-Null
  $title = $sb.ToString()
  if ($title -like "*$TitleMatch*" -and ($title -like "*Chrome*" -or $title -like "*Edge*")) {
    $script:found += [pscustomobject]@{ HWnd = $h; Title = $title }
  }
  return $true
}
[W32]::EnumWindows($cb, [IntPtr]::Zero) | Out-Null

if ($found.Count -eq 0) {
  Write-Error "No Chrome window found with title containing '$TitleMatch'"
  exit 2
}
$win = $found[0]
Write-Host "Window: [$($win.HWnd)] $($win.Title)"
$hwnd = $win.HWnd

# Bring to foreground (best-effort) — needed for SendKeys
$tForeground = [W32]::GetWindowThreadProcessId([IntPtr]::Zero, [ref]([uint32]0))
$pid2 = 0
$tTarget = [W32]::GetWindowThreadProcessId($hwnd, [ref]$pid2)
$tMe = [W32]::GetCurrentThreadId()
[W32]::AttachThreadInput($tMe, $tTarget, $true) | Out-Null
[W32]::ShowWindow($hwnd, 9) | Out-Null  # SW_RESTORE
[W32]::SetForegroundWindow($hwnd) | Out-Null
[W32]::AttachThreadInput($tMe, $tTarget, $false) | Out-Null
Start-Sleep -Milliseconds 400

if ($Reload)              { [System.Windows.Forms.SendKeys]::SendWait("{F5}"); Start-Sleep -Milliseconds $WaitMs }
if ($ToggleDevTools)      { [System.Windows.Forms.SendKeys]::SendWait("{F12}"); Start-Sleep -Milliseconds 800 }
if ($ScrollConsoleTop)    { [System.Windows.Forms.SendKeys]::SendWait("^{HOME}"); Start-Sleep -Milliseconds 300 }
if ($ScrollConsoleBottom) { [System.Windows.Forms.SendKeys]::SendWait("^{END}"); Start-Sleep -Milliseconds 300 }

Start-Sleep -Milliseconds 600

$rect = New-Object W32+RECT
[W32]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$w = $rect.Right - $rect.Left
$h = $rect.Bottom - $rect.Top
Write-Host "Capturing $w x $h ..."
$bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$hdc = $g.GetHdc()
# PW_RENDERFULLCONTENT = 0x00000002 (Win 8.1+, captures Chromium windows correctly)
$ok = [W32]::PrintWindow($hwnd, $hdc, 2)
$g.ReleaseHdc($hdc)
$g.Dispose()
if (-not $ok) { Write-Warning "PrintWindow returned false; image may be blank" }

$dir = Split-Path $OutFile -Parent
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$bmp.Save($OutFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Saved: $OutFile  ($((Get-Item $OutFile).Length) bytes)"
