"""
run_eval.py
───────────
Evaluation harness that runs the gold dataset through the Employee Agent and computes
Citation Correctness %.

Citation Correctness %  =  Correct Citations / Total Citations
    • A citation (document_name, page_number) is "correct" if it matches one of the
      expected citations for that question.
    • For refusal questions (answerable=false), success = the agent returned exactly
      "Not covered by policy." (these contribute to refusal accuracy, not citation %).

Outputs:
    • Console table
    • evaluation/eval_results.json   (machine-readable)
    • evaluation/eval_results.md     (human-readable report fragment)

Run:
    python evaluation/run_eval.py
"""

from __future__ import annotations

import json
from pathlib import Path

try:
    from ..app.employee_agent import REFUSAL, answer_question
except ImportError:  # pragma: no cover
    import sys

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from app.employee_agent import REFUSAL, answer_question  # type: ignore

EVAL_DIR = Path(__file__).resolve().parent
DATASET = EVAL_DIR / "eval_dataset.json"
TARGET_CITATION_CORRECTNESS = 90.0


def _expected_set(item: dict) -> set[tuple[str, int]]:
    return {
        (c["document_name"].lower(), c["page_number"])
        for c in item.get("expected_citations", [])
    }


def run() -> dict:
    data = json.loads(DATASET.read_text(encoding="utf-8"))
    questions = data["questions"]

    rows = []
    total_citations = 0
    correct_citations = 0
    refusal_total = 0
    refusal_correct = 0

    for item in questions:
        resp = answer_question(item["question"])
        expected = _expected_set(item)

        if not item["answerable"]:
            refusal_total += 1
            ok = resp.refused and resp.answer.strip() == REFUSAL
            refusal_correct += int(ok)
            rows.append(
                {
                    "id": item["id"],
                    "question": item["question"],
                    "answerable": False,
                    "generated_answer": resp.answer,
                    "generated_citations": [],
                    "expected_citations": [],
                    "citation_correct": None,
                    "refusal_ok": ok,
                }
            )
            continue

        gen = [(d.lower(), p) for d, p in resp.citations]
        item_correct = sum(1 for c in gen if c in expected)
        total_citations += len(gen)
        correct_citations += item_correct

        rows.append(
            {
                "id": item["id"],
                "question": item["question"],
                "answerable": True,
                "generated_answer": resp.answer,
                "generated_citations": [f"({d}, Page {p})" for d, p in resp.citations],
                "expected_citations": [
                    f"({c['document_name']}, Page {c['page_number']})"
                    for c in item["expected_citations"]
                ],
                "retrieved_chunks": [
                    f"({c.document_name}, Page {c.page_number}) — {c.policy_section}"
                    for c in resp.chunks
                ],
                "citation_correct": f"{item_correct}/{len(gen)}",
                "refusal_ok": None,
            }
        )

    citation_pct = (correct_citations / total_citations * 100) if total_citations else 0.0
    refusal_pct = (refusal_correct / refusal_total * 100) if refusal_total else 0.0

    summary = {
        "total_questions": len(questions),
        "total_citations": total_citations,
        "correct_citations": correct_citations,
        "citation_correctness_pct": round(citation_pct, 1),
        "refusal_accuracy_pct": round(refusal_pct, 1),
        "target_pct": TARGET_CITATION_CORRECTNESS,
        "passed": citation_pct >= TARGET_CITATION_CORRECTNESS,
        "rows": rows,
    }
    return summary


def _write_markdown(summary: dict) -> None:
    lines = [
        "# Evaluation Results\n",
        f"- **Citation Correctness:** {summary['citation_correctness_pct']}% "
        f"(target ≥ {summary['target_pct']}%) — "
        f"{'PASS ✅' if summary['passed'] else 'FAIL ❌'}",
        f"- **Refusal Accuracy:** {summary['refusal_accuracy_pct']}%",
        f"- **Correct / Total Citations:** "
        f"{summary['correct_citations']} / {summary['total_citations']}\n",
        "| ID | Question | Expected Citation | Generated Citation | Correct |",
        "|----|----------|-------------------|--------------------|---------|",
    ]
    for r in summary["rows"]:
        exp = "; ".join(r["expected_citations"]) if r["answerable"] else "Refusal"
        gen = "; ".join(r["generated_citations"]) if r["answerable"] else r["generated_answer"]
        correct = r["citation_correct"] if r["answerable"] else ("✅" if r["refusal_ok"] else "❌")
        lines.append(f"| {r['id']} | {r['question']} | {exp} | {gen} | {correct} |")
    (EVAL_DIR / "eval_results.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    summary = run()
    (EVAL_DIR / "eval_results.json").write_text(
        json.dumps(summary, indent=2), encoding="utf-8"
    )
    _write_markdown(summary)

    print("\n=== Evaluation Summary ===")
    print(f"Citation Correctness : {summary['citation_correctness_pct']}% "
          f"(target ≥ {summary['target_pct']}%)")
    print(f"Refusal Accuracy     : {summary['refusal_accuracy_pct']}%")
    print(f"Result               : {'PASS ✅' if summary['passed'] else 'FAIL ❌'}")
    print("Wrote eval_results.json and eval_results.md")


if __name__ == "__main__":
    main()
