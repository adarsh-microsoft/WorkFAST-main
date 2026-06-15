"""Probe a knowledge-check page to dump its DOM structure so we can build the right selector."""
import asyncio, json
from playwright.async_api import async_playwright

CDP = "http://localhost:9222"
URL = "https://learn.microsoft.com/en-us/training/modules/build-and-store-container-images/6-knowledge-check/?source=learn&ns-enrollment-type=learningpath&ns-enrollment-id=learn.administer-containers-in-azure"


async def main():
    pw = await async_playwright().start()
    browser = await pw.chromium.connect_over_cdp(CDP)
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else await ctx.new_page()
    await page.bring_to_front()
    await page.goto(URL, wait_until="domcontentloaded", timeout=45000)
    try:
        await page.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass
    info = await page.evaluate(r"""
    () => {
      const forms = Array.from(document.querySelectorAll('form'));
      const out = forms.map((f, i) => ({
        idx: i,
        action: f.getAttribute('action'),
        className: f.className,
        innerSampleLen: f.innerText.length,
        innerSample: f.innerText.slice(0, 400),
        radios: f.querySelectorAll('input[type=radio]').length,
        checkboxes: f.querySelectorAll('input[type=checkbox]').length,
        fieldsets: f.querySelectorAll('fieldset').length,
      }));
      // Also scan for any radio inputs anywhere
      const allRadios = Array.from(document.querySelectorAll('input[type=radio]'));
      const allCB = Array.from(document.querySelectorAll('input[type=checkbox]'));
      // Look for any element with role="radiogroup" or quiz-like structures
      const radioGroups = Array.from(document.querySelectorAll('[role=radiogroup]')).map(g => ({
        ariaLabel: g.getAttribute('aria-label'),
        ariaLabelledBy: g.getAttribute('aria-labelledby'),
        children: g.children.length,
        outerSample: g.outerHTML.slice(0, 300),
      }));
      // Headings on page
      const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(h => h.tagName + ': ' + h.innerText.trim().slice(0, 80));
      return { formsCount: forms.length, forms: out, allRadiosCount: allRadios.length, allCBCount: allCB.length, radioGroups, headings, title: document.title, url: location.href };
    }
    """)
    print(json.dumps(info, indent=2))
    await browser.close()
    await pw.stop()


asyncio.run(main())
