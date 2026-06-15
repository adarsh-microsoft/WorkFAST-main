"""Walk an MS Learn module unit-by-unit via CDP-attached Chrome.
Stops + dumps JSON when it hits a Knowledge Check or end-of-module."""
import asyncio, json, sys
from playwright.async_api import async_playwright

CDP = "http://localhost:9222"

MODULES = [
    {
        "slug": "intro-to-docker-containers",
        "units": [
            "1-introduction", "2-what-is-docker", "3-how-docker-images-work",
            "4-how-docker-containers-work", "5-when-use-docker-containers", "6-summary"
        ],
    },
    {
        "slug": "intro-to-containers",
        "units": [
            "1-introduction", "2-deploy-docker-image-locally",
            "3-exercise-deploy-docker-image-locally", "4-create-custom-docker-image",
            "5-exercise-create-custom-docker-image", "6-deploy-docker-image-to-container-instance",
            "7-exercise-deploy-docker-image-to-container-instance", "8-summary"
        ],
    },
    {
        "slug": "build-and-store-container-images",
        "units": [
            "1-intro-to-azure-container-registry", "2-deploy-azure-container-registry",
            "3-build-container-image", "4-deploy-container-image",
            "5-replicate-container-image", "6-knowledge-check"
        ],
    },
    {
        "slug": "intro-to-kubernetes",
        "units": [
            "1-introduction", "2-what-is-kubernetes", "3-how-kubernetes-works",
            "4-how-app-deployments-work", "5-exercise-kubernetes-functionality",
            "6-when-to-use-kubernetes", "7-summary"
        ],
    },
    {
        "slug": "intro-to-azure-kubernetes-service",
        "units": [
            "1-introduction", "2-what-is-azure-kubernetes-service",
            "3-how-azure-kubernetes-service-works", "4-when-to-use-azure-kubernetes-service",
            "5-knowledge-check", "6-summary"
        ],
    },
    {
        "slug": "intro-to-azure-ad",
        "units": [
            "1-introduction", "2-overview", "3-understand-licenses-terminology",
            "4-essential-features", "5-get-started", "6-summary"
        ],
    },
]
PATH_QS = "?source=learn&ns-enrollment-type=learningpath&ns-enrollment-id=learn.administer-containers-in-azure"


def unit_url(slug, unit):
    # Standalone modules (not part of the containers path) skip the learning-path qs.
    standalone = {"intro-to-azure-ad"}
    if slug in standalone:
        return f"https://learn.microsoft.com/en-us/training/modules/{slug}/{unit}/"
    return f"https://learn.microsoft.com/en-us/training/modules/{slug}/{unit}/{PATH_QS}"


async def connect():
    pw = await async_playwright().start()
    browser = await pw.chromium.connect_over_cdp(CDP)
    ctx = browser.contexts[0]
    return pw, browser, ctx


async def get_or_make_page(ctx):
    for p in ctx.pages:
        if "learn.microsoft.com" in p.url:
            return p
    return await ctx.new_page()


async def detect_kc(page):
    """Return KC questions array or [] if no KC on this page.
    MS Learn KC structure: form.quiz-form contains a sequence of
    div[role=radiogroup] (one per question), each with aria-labelledby='quiz-question-N'
    pointing to a div containing the question text. Options follow as label > input[type=radio|checkbox].
    """
    return await page.evaluate(r"""
    () => {
      const form = document.querySelector('form.quiz-form');
      if (!form) return [];
      // Question text divs and option groups can be siblings. Use radiogroup as anchor.
      const groups = Array.from(form.querySelectorAll('[role=radiogroup]'));
      const out = [];
      groups.forEach((g, idx) => {
        const labId = g.getAttribute('aria-labelledby');
        const labEl = labId ? document.getElementById(labId) : null;
        const qText = labEl ? labEl.innerText.replace(/^\d+\.\s*/, '').trim() : g.innerText.trim().slice(0, 200);
        // Options: look for the NEXT sibling(s) until next radiogroup. Typically labels inside.
        // Easier: find inputs whose name == ('quiz-question-N-answer') or similar; or just grab the inputs that follow this group.
        // We'll walk forward in DOM order collecting inputs until next radiogroup.
        const all = Array.from(form.querySelectorAll('[role=radiogroup], input[type=radio], input[type=checkbox]'));
        const myPos = all.indexOf(g);
        let nextGroupPos = all.length;
        for (let i = myPos + 1; i < all.length; i++) {
          if (all[i].getAttribute && all[i].getAttribute('role') === 'radiogroup') { nextGroupPos = i; break; }
        }
        const inputs = all.slice(myPos + 1, nextGroupPos).filter(el => el.tagName === 'INPUT');
        if (!inputs.length) return;
        const type = inputs[0].type === 'checkbox' ? 'multi' : 'single';
        const options = inputs.map(inp => {
          const lab = document.querySelector('label[for="'+inp.id+'"]') || inp.closest('label');
          let text = lab ? lab.innerText.trim() : '';
          // Strip leading bullets/numbers if any
          text = text.replace(/^[\u2022\-\d.]\s*/, '').trim();
          return { id: inp.id, value: inp.value, label: text };
        });
        out.push({ idx, question: qText, type, options });
      });
      return out;
    }
    """)


async def visit_unit(page, url):
    """Navigate to a unit and wait for it to load + mark visited."""
    await page.goto(url, wait_until="domcontentloaded", timeout=45000)
    # Skip networkidle (hangs on telemetry-heavy pages). Just brief settle + scroll.
    await asyncio.sleep(1.2)
    try:
        await page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(0.4)
        await page.evaluate("() => window.scrollTo(0, 0)")
        await asyncio.sleep(0.2)
    except Exception:
        pass


async def click_next(page):
    """Click the 'Next' button at the bottom of a unit. Returns whether clicked."""
    # MS Learn pagination uses <a> tags with rel="next" or class containing "next" or text "Next"
    selectors = [
        'a[data-test-pagination-link="next"]',
        'a[aria-label="Next"]',
        'nav a:has-text("Next")',
        'a.button:has-text("Next")',
        'a:has-text("Next ›")',
    ]
    for sel in selectors:
        loc = page.locator(sel).first
        if await loc.count() > 0 and await loc.is_visible():
            await loc.click()
            return True
    return False


async def cmd_visit_module(midx, start=0):
    mod = MODULES[midx]
    pw, browser, ctx = await connect()
    try:
        page = await get_or_make_page(ctx)
        await page.bring_to_front()
        results = []
        for i, unit in enumerate(mod["units"]):
            if i < start:
                continue
            url = unit_url(mod["slug"], unit)
            try:
                await visit_unit(page, url)
                title = await page.title()
                kc = await detect_kc(page)
            except Exception as ex:
                results.append({"unit": unit, "status": "error", "err": str(ex)})
                print(json.dumps({"module": mod["slug"], "results": results, "stopped": True}, indent=2))
                return
            if kc:
                results.append({"unit": unit, "status": "knowledge_check", "questions": kc})
                print(json.dumps({"module": mod["slug"], "results": results}, indent=2))
                return
            else:
                results.append({"unit": unit, "status": "visited", "title": title})
        print(json.dumps({"module": mod["slug"], "results": results, "completed": True}, indent=2))
    finally:
        await browser.close()
        await pw.stop()


async def cmd_answer_kc(midx, unit, answers_arg):
    """answers_arg: either JSON literal or path to JSON file.
    Format: [{"idx": N, "selected": [option-index-int, ...]}]"""
    mod = MODULES[midx]
    url = unit_url(mod["slug"], unit)
    import os
    if os.path.isfile(answers_arg):
        with open(answers_arg, 'r', encoding='utf-8') as f:
            answers = json.load(f)
    else:
        answers = json.loads(answers_arg)
    pw, browser, ctx = await connect()
    try:
        page = await get_or_make_page(ctx)
        await page.bring_to_front()
        await visit_unit(page, url)
        kc = await detect_kc(page)
        if not kc:
            print(json.dumps({"error": "no KC detected", "url": url}))
            return
        # Click each selected option
        for a in answers:
            q = kc[a["idx"]]
            for si in a["selected"]:
                opt_id = q["options"][int(si)]["id"]
                await page.locator(f'#{opt_id}').check()
        # Find Check answers button (MS Learn uses button text "Check your answers" or "Check answers")
        check_btn = page.locator('form.quiz-form button[type="submit"], button:has-text("Check your answers"), button:has-text("Check answers")').first
        await check_btn.scroll_into_view_if_needed()
        await check_btn.click()
        try:
            await page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        await asyncio.sleep(2.5)
        # Capture result text
        result = await page.evaluate(r"""
        () => {
          const main = document.querySelector('main') || document.body;
          const txt = main.innerText;
          // Look for typical pass/fail UI
          const passSignal = /you (passed|answered) (all )?\d+ (of \d+ )?questions correctly|congratulations|you got all the answers correct|all answers (are )?correct/i.test(txt);
          const failSignal = /you got \d+ of \d+ correct|answered \d+ of \d+ correctly|incorrect|try again/i.test(txt);
          // Per-question status
          const groups = Array.from(document.querySelectorAll('form.quiz-form [role=radiogroup]'));
          const perQ = groups.map((g, i) => {
            const parent = g.parentElement;
            const ptxt = (parent && parent.innerText) || '';
            const correct = /correct/i.test(ptxt) && !/incorrect/i.test(ptxt);
            const incorrect = /incorrect|that's not (the )?right/i.test(ptxt);
            return { idx: i, correct, incorrect };
          });
          return { passSignal, failSignal, perQ, snippet: txt.slice(0, 1500) };
        }
        """)
        print(json.dumps({"submitted": True, "url": url, "result": result}, indent=2))
    finally:
        await browser.close()
        await pw.stop()


def main():
    if len(sys.argv) < 2:
        print(__doc__); return
    cmd = sys.argv[1]
    if cmd == "list":
        for i, m in enumerate(MODULES):
            print(f"{i}: {m['slug']} ({len(m['units'])} units)")
    elif cmd == "visit":
        start = int(sys.argv[3]) if len(sys.argv) > 3 else 0
        asyncio.run(cmd_visit_module(int(sys.argv[2]), start))
    elif cmd == "answer":
        # args: <midx> <unit_slug> <answers_json>
        asyncio.run(cmd_answer_kc(int(sys.argv[2]), sys.argv[3], sys.argv[4]))


if __name__ == "__main__":
    main()
