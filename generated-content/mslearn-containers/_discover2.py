import asyncio, json
from playwright.async_api import async_playwright
async def main():
    pw = await async_playwright().start()
    b = await pw.chromium.connect_over_cdp('http://localhost:9222')
    ctx = b.contexts[0]
    page = ctx.pages[0]
    await page.bring_to_front()
    await page.goto('https://learn.microsoft.com/en-us/training/modules/intro-to-azure-ad/1-introduction/', wait_until='domcontentloaded', timeout=45000)
    await asyncio.sleep(2)
    out = await page.evaluate(r'''
    () => {
      const anchors = Array.from(document.querySelectorAll('a[href*=\"/training/modules/intro-to-azure-ad/\"]'));
      const seen = new Set(); const units = [];
      for (const a of anchors) {
        try {
          const u = new URL(a.href);
          const m = u.pathname.match(/\/training\/modules\/intro-to-azure-ad\/([^/]+)\/?$/);
          if (!m) continue;
          const slug = m[1];
          if (!/^\d+-/.test(slug)) continue;
          if (seen.has(slug)) continue;
          seen.add(slug);
          units.push({slug, title: a.textContent.trim(), href: u.pathname});
        } catch(e) {}
      }
      units.sort((a,b)=>parseInt(a.slug)-parseInt(b.slug));
      return units;
    }
    ''')
    print(json.dumps(out, indent=2))
    await b.close(); await pw.stop()
asyncio.run(main())
