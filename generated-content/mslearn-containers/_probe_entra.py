import asyncio, json
from playwright.async_api import async_playwright


async def main():
    pw = await async_playwright().start()
    b = await pw.chromium.connect_over_cdp('http://localhost:9222')
    ctx = b.contexts[0]
    page = ctx.pages[0]
    await page.bring_to_front()
    await page.goto('https://learn.microsoft.com/en-us/training/modules/intro-to-azure-ad/2-overview/', wait_until='domcontentloaded', timeout=45000)
    await asyncio.sleep(2)
    info = await page.evaluate(r"""
    () => {
      const form = document.querySelector('form.quiz-form');
      if (!form) return {hasForm: false};
      const btn = form.querySelector('button[type=submit]');
      const passSig = /Module assessment passed|you passed the module|Score: 100%|Score: \d+%/i.exec(document.body.innerText);
      // Look for "Correct" markers near each radiogroup
      const groups = Array.from(form.querySelectorAll('[role=radiogroup]'));
      const perQ = groups.map((g, i) => {
        const sib = g.nextElementSibling;
        const sibTxt = sib ? sib.innerText.slice(0, 200) : '';
        const parentTxt = g.parentElement ? g.parentElement.innerText.slice(0, 600) : '';
        const inputs = Array.from(g.parentElement.querySelectorAll('input[type=radio], input[type=checkbox]'));
        const checked = inputs.filter(i => i.checked).map(i => i.id);
        return {idx: i, sibTxt, parentTxtSnippet: parentTxt, checked};
      });
      return {
        hasForm: true,
        buttonText: btn ? btn.innerText.trim() : null,
        buttonDisabled: btn ? btn.disabled : null,
        passSignal: passSig ? passSig[0] : null,
        perQ,
        bodySnippet: document.body.innerText.slice(0, 2000),
      };
    }
    """)
    print(json.dumps(info, indent=2))
    await b.close()
    await pw.stop()


asyncio.run(main())
