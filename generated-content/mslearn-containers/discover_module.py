"""Discover units of a single MS Learn module via CDP-attached Chrome.
Dumps unit list (slug + title + url) as JSON."""
import asyncio, json, sys
from playwright.async_api import async_playwright

CDP = "http://localhost:9222"


async def main(module_url):
    pw = await async_playwright().start()
    browser = await pw.chromium.connect_over_cdp(CDP)
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else await ctx.new_page()
    await page.bring_to_front()
    await page.goto(module_url, wait_until="domcontentloaded", timeout=45000)
    await asyncio.sleep(2)
    info = await page.evaluate(r"""
    () => {
      // MS Learn module landing page lists unit links under "Units" section.
      // Each link href ends with `/<n>-slug/`
      const anchors = Array.from(document.querySelectorAll('a[href*="/training/modules/"]'));
      const here = new URL(location.href);
      const modulePathMatch = here.pathname.match(/^(\/.*\/training\/modules\/[^/]+\/)/);
      const modulePath = modulePathMatch ? modulePathMatch[1] : '';
      const units = [];
      const seen = new Set();
      for (const a of anchors) {
        try {
          const u = new URL(a.href);
          if (!u.pathname.startsWith(modulePath)) continue;
          const rest = u.pathname.slice(modulePath.length).replace(/\/$/, '');
          if (!rest) continue;
          if (rest.includes('/')) continue; // only direct child unit slug
          if (!/^\d+-/.test(rest)) continue;
          if (seen.has(rest)) continue;
          seen.add(rest);
          units.push({ slug: rest, title: a.textContent.trim(), url: u.href });
        } catch (e) {}
      }
      units.sort((a, b) => parseInt(a.slug) - parseInt(b.slug));
      // Module metadata
      const h1 = document.querySelector('h1');
      return { module: h1 ? h1.innerText.trim() : document.title, modulePath, units };
    }
    """)
    print(json.dumps(info, indent=2))
    await browser.close()
    await pw.stop()


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1]))
