import asyncio, json
from playwright.async_api import async_playwright

URL = 'https://learn.microsoft.com/en-us/training/modules/intro-to-azure-ad/2-overview/'
ANSWERS = [(0, 0), (1, 1)]  # (question idx, option idx)


async def main():
    pw = await async_playwright().start()
    b = await pw.chromium.connect_over_cdp('http://localhost:9222')
    ctx = b.contexts[0]
    page = ctx.pages[0]
    await page.bring_to_front()
    await page.goto(URL, wait_until='domcontentloaded', timeout=45000)
    await asyncio.sleep(2)
    # scroll to KC
    await page.evaluate("() => document.querySelector('form.quiz-form')?.scrollIntoView({block:'start'})")
    await asyncio.sleep(0.6)
    # Build current state
    state = await page.evaluate(r"""
    () => {
      const form = document.querySelector('form.quiz-form');
      if (!form) return null;
      const groups = Array.from(form.querySelectorAll('[role=radiogroup]'));
      const out = groups.map((g, i) => {
        const inputs = Array.from(g.parentElement.querySelectorAll('input[type=radio], input[type=checkbox]'));
        return { idx: i, ids: inputs.map(x => x.id) };
      });
      return out;
    }
    """)
    print("State before:", json.dumps(state))
    # Click each option
    for q_idx, opt_idx in ANSWERS:
        opt_id = state[q_idx]['ids'][opt_idx]
        loc = page.locator(f'#{opt_id}')
        await loc.scroll_into_view_if_needed()
        await loc.check(force=True)
        await asyncio.sleep(0.3)
        is_checked = await loc.is_checked()
        print(f"Q{q_idx} opt {opt_idx} ({opt_id}): checked={is_checked}")
    # Now click Check answers
    btn = page.locator('form.quiz-form button[type="submit"]').first
    await btn.scroll_into_view_if_needed()
    print("Button text:", await btn.text_content())
    print("Button disabled:", await btn.is_disabled())
    await btn.click()
    print("Clicked submit")
    await asyncio.sleep(4)
    # Don't navigate. Read result.
    after = await page.evaluate(r"""
    () => {
      const body = document.body.innerText;
      const passSig = /Module assessment passed|You passed the module|Score: \d+%|all answers (are )?correct/i.exec(body);
      const form = document.querySelector('form.quiz-form');
      const formText = form ? form.innerText.slice(0, 3000) : null;
      const correctCount = (formText || '').match(/\bCorrect\b/g)?.length || 0;
      const incorrectCount = (formText || '').match(/\bIncorrect\b/g)?.length || 0;
      return { passSig: passSig ? passSig[0] : null, formText, correctCount, incorrectCount, bodySnippet: body.slice(0, 2500) };
    }
    """)
    print(json.dumps({"after_submit": after}, indent=2))
    await b.close()
    await pw.stop()


asyncio.run(main())
