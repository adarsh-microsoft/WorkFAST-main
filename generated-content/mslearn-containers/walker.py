"""
Connect to user's CDP-attached Chrome (port 9222), navigate the
'Administer containers in Azure' MS Learn path, and dump structured state.

Usage:
  python walker.py status         # auth state + module list
  python walker.py walk <url>     # click Next through a module until end / knowledge-check, dump KC questions to stdout JSON
  python walker.py answer <url> <answers_json>  # fill+submit KC answers, then click Continue
"""
import asyncio
import json
import sys
from playwright.async_api import async_playwright

CDP = "http://localhost:9222"
PATH_URL = "https://learn.microsoft.com/en-us/training/paths/administer-containers-in-azure/"


async def connect():
    pw = await async_playwright().start()
    browser = await pw.chromium.connect_over_cdp(CDP)
    ctx = browser.contexts[0]
    return pw, browser, ctx


async def find_or_open(ctx, url_substr, navigate_url=None):
    for p in ctx.pages:
        if url_substr in p.url:
            return p
    page = await ctx.new_page()
    await page.goto(navigate_url or url_substr, wait_until="domcontentloaded", timeout=60000)
    return page


async def cmd_status():
    pw, browser, ctx = await connect()
    try:
        page = await find_or_open(ctx, "learn.microsoft.com/en-us/training/paths/administer-containers", PATH_URL)
        await page.bring_to_front()
        await page.wait_for_load_state("networkidle", timeout=30000)
        result = await page.evaluate("""
        () => {
          const signInLink = Array.from(document.querySelectorAll('a')).find(a => (a.textContent||'').trim()==='Sign in');
          const userBtn = document.querySelector('[data-test-id="user-name-button"], [data-bi-name="user-menu"], button[aria-label*="account manager" i]');
          const modules = Array.from(document.querySelectorAll('h2 + div a, [data-bi-name="learning-path-modules"] a, a[href*="/training/modules/"]'))
              .filter(a => a.textContent && a.textContent.trim().length > 0)
              .map(a => ({title: a.textContent.trim(), url: a.href}));
          // Dedupe by URL, keep first
          const seen = new Set();
          const dedup = modules.filter(m => { if (seen.has(m.url)) return false; seen.add(m.url); return true; });
          return { signedIn: !signInLink, hasUserBtn: !!userBtn, modules: dedup };
        }
        """)
        print(json.dumps(result, indent=2))
    finally:
        await browser.close()
        await pw.stop()


async def click_next_or_finish(page):
    """Click the primary 'Next' / 'Continue' button. Returns the button text."""
    selectors = [
        'button:has-text("Next")',
        'a:has-text("Next")',
        'button:has-text("Continue")',
        'a:has-text("Continue")',
    ]
    for sel in selectors:
        btn = page.locator(sel).first
        if await btn.count() > 0 and await btn.is_visible():
            txt = (await btn.text_content() or "").strip()
            await btn.scroll_into_view_if_needed()
            await btn.click()
            return txt
    return None


async def detect_knowledge_check(page):
    """Return list of KC questions with options + radio/checkbox ids, or [] if no KC on this page."""
    return await page.evaluate("""
    () => {
      // KC questions live in <form> tags inside module content. Each question is typically:
      //   <fieldset> <legend>Question text</legend> <ul>radio/checkbox options</ul> </fieldset>
      const fieldsets = Array.from(document.querySelectorAll('form fieldset'));
      if (!fieldsets.length) return [];
      return fieldsets.map((fs, idx) => {
        const legend = fs.querySelector('legend');
        const qText = legend ? legend.textContent.trim() : '';
        const inputs = Array.from(fs.querySelectorAll('input[type=radio], input[type=checkbox]'));
        const type = inputs.length && inputs[0].type === 'checkbox' ? 'multi' : 'single';
        const options = inputs.map(inp => {
          const label = inp.closest('label') || document.querySelector('label[for="'+inp.id+'"]');
          return { id: inp.id, name: inp.name, value: inp.value, label: label ? label.textContent.trim() : '' };
        });
        return { idx, question: qText, type, options };
      });
    }
    """)


async def cmd_walk(module_url):
    pw, browser, ctx = await connect()
    try:
        page = await find_or_open(ctx, module_url.split('?')[0], module_url)
        await page.bring_to_front()
        await page.wait_for_load_state("networkidle", timeout=30000)
        log = []
        max_steps = 30
        for i in range(max_steps):
            url = page.url
            title = await page.title()
            # Look for knowledge check
            kc = await detect_knowledge_check(page)
            if kc:
                # Capture full page text for context too
                body_text = await page.evaluate("() => document.querySelector('main')?.innerText || document.body.innerText")
                print(json.dumps({
                    "step": i, "state": "knowledge_check", "url": url, "title": title,
                    "questions": kc, "body_excerpt": body_text[:3000]
                }, indent=2))
                return
            # Try clicking Next/Continue
            btn = await click_next_or_finish(page)
            log.append({"step": i, "url": url, "title": title, "clicked": btn})
            if not btn:
                print(json.dumps({"state": "no_next_button", "url": url, "title": title, "log": log}, indent=2))
                return
            await page.wait_for_load_state("networkidle", timeout=20000)
        print(json.dumps({"state": "max_steps_reached", "log": log}, indent=2))
    finally:
        await browser.close()
        await pw.stop()


async def cmd_answer(module_url, answers_json):
    """answers_json: [{"idx": 0, "selected": ["0"]}, ...]  selected = list of option indices (0-based)"""
    answers = json.loads(answers_json)
    pw, browser, ctx = await connect()
    try:
        page = await find_or_open(ctx, module_url.split('?')[0], module_url)
        await page.bring_to_front()
        await page.wait_for_load_state("networkidle", timeout=30000)
        kc = await detect_knowledge_check(page)
        if not kc:
            print(json.dumps({"error": "no knowledge check on this page", "url": page.url}))
            return
        for ans in answers:
            q = kc[ans["idx"]]
            for sel_idx in ans["selected"]:
                inp_id = q["options"][int(sel_idx)]["id"]
                await page.locator(f'#{inp_id}').check()
        # Submit
        submit = page.locator('button[type="submit"]:visible, button:has-text("Check answers"):visible').first
        await submit.click()
        await page.wait_for_load_state("networkidle", timeout=20000)
        # Read result + next button
        result = await page.evaluate("""
        () => {
          const main = document.querySelector('main');
          const text = main ? main.innerText : document.body.innerText;
          const passed = /correct|congratulations|passed/i.test(text);
          const failed = /try again|incorrect/i.test(text) && !passed;
          return { passed, failed, snippet: text.slice(0, 1500) };
        }
        """)
        # Click continue if present
        cont = page.locator('button:has-text("Continue"):visible, a:has-text("Continue"):visible, button:has-text("Next"):visible, a:has-text("Next"):visible').first
        clicked = None
        if await cont.count() > 0:
            txt = (await cont.text_content() or "").strip()
            await cont.click()
            clicked = txt
            await page.wait_for_load_state("networkidle", timeout=20000)
        print(json.dumps({"submitted": True, "result": result, "clicked_after": clicked, "url_after": page.url}, indent=2))
    finally:
        await browser.close()
        await pw.stop()


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "status":
        asyncio.run(cmd_status())
    elif cmd == "walk":
        asyncio.run(cmd_walk(sys.argv[2]))
    elif cmd == "answer":
        asyncio.run(cmd_answer(sys.argv[2], sys.argv[3]))
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
