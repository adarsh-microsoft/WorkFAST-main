// Headless screenshot of the mock embed page (includes synthetic DevTools console panel
// rendered into the page). Uses system Chrome via Playwright channel.
const { chromium } = require('playwright');
const path = require('path');

const HTML = 'file:///' + path.resolve(__dirname, 'mock-embed.html').replace(/\\/g, '/');
const OUT  = path.resolve(__dirname, '..', 'PowerBIEmbed_adarshd', 'screenshots');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const ps of ['ps3', 'ps4', 'ps5']) {
    await page.goto(HTML + '?ps=' + ps);
    await page.waitForTimeout(1200);
    const out = path.join(OUT, ps + '-console.png');
    await page.screenshot({ path: out, fullPage: true });
    console.log('Saved', out);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
