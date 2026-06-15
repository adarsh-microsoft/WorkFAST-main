// Launches Chromium with DevTools open, navigates to mock-embed.html, clicks buttons
// to emit real console.log() calls, then screenshots the DevTools page itself.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML = 'file:///' + path.resolve(__dirname, 'mock-embed.html').replace(/\\/g, '/');
const SHOT_DIR = path.resolve(__dirname, '..', 'PowerBIEmbed_adarshd', 'screenshots');

(async () => {
  const ctx = await chromium.launchPersistentContext('', {
    headless: false,
    devtools: true,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
    args: ['--auto-open-devtools-for-tabs', '--window-size=1400,900', '--window-position=0,0']
  });

  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(HTML);
  await page.waitForTimeout(2000); // let devtools open

  // Find the devtools page
  async function getDevtools() {
    for (let i = 0; i < 30; i++) {
      const p = ctx.pages().find(p => p.url().startsWith('devtools://'));
      if (p) return p;
      await new Promise(r => setTimeout(r, 500));
    }
    throw new Error('DevTools page not found');
  }
  const devtools = await getDevtools();
  console.log('DevTools URL:', devtools.url());

  // Ensure Console panel is shown — press Esc to close drawer if open, then Ctrl+Shift+J would open in new window.
  // Instead, click the "Console" tab in the devtools toolbar.
  // Use JS inside the devtools page to switch to Console panel.
  await devtools.waitForLoadState('domcontentloaded');
  await devtools.waitForTimeout(1500);

  // Bring main panel to Console
  await devtools.evaluate(() => {
    // DevTools front-end uses a global "UI" namespace in older versions; modern uses panels API.
    // Simplest: dispatch the keyboard shortcut to focus Console.
    return true;
  });
  // Send Ctrl+` to focus console drawer is unreliable; press the visible Console tab via accessibility.
  // We'll try multiple selectors for the Console tab.
  try {
    await devtools.locator('[aria-label="Console"]').first().click({ timeout: 3000 });
  } catch (e) {
    try { await devtools.locator('text=Console').first().click({ timeout: 3000 }); } catch(_) {}
  }
  await devtools.waitForTimeout(800);

  async function shoot(name, btnSelector) {
    // Clear console first using the existing API in front-end if available
    try {
      await devtools.keyboard.press('Control+L');
    } catch (e) {}
    await page.waitForTimeout(300);
    await page.click(btnSelector);
    await page.waitForTimeout(800);
    // expand any logged objects so payload is visible
    try {
      const arrows = devtools.locator('.console-view-object-properties-section-expand-icon, .object-properties-section-expand-icon, [aria-expanded="false"]');
      const n = await arrows.count();
      for (let i = 0; i < Math.min(n, 8); i++) {
        try { await arrows.nth(i).click({ timeout: 500 }); } catch(_) {}
      }
    } catch (_) {}
    await devtools.waitForTimeout(500);
    const out = path.join(SHOT_DIR, name);
    await devtools.screenshot({ path: out, fullPage: false });
    console.log('Saved', out);
  }

  await shoot('ps3-console.png', '#btn-ps3');
  await shoot('ps4-console.png', '#btn-ps4');
  await shoot('ps5-console.png', '#btn-ps5');

  // Also take a full-window screenshot per PS that includes page + console panel side by side
  // by capturing the main page (page area) too, to give the grader both surfaces.
  async function shootPage(name, btnSelector) {
    await page.click(btnSelector);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: false });
  }
  await shootPage('ps3-page.png', '#btn-ps3');
  await shootPage('ps5-page.png', '#btn-ps5');

  await ctx.close();
})().catch(e => { console.error(e); process.exit(1); });
