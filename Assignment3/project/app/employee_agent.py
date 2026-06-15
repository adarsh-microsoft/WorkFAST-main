"""
employee_agent.py
─────────────────
The Employee Agent. Orchestrates the full grounded Q&A pipeline:

    retrieve (hybrid + semantic)  →  build grounded prompt  →  GPT-4o-mini  →  answer

Compliance behavior enforced here:
  • Every factual sentence must carry an inline citation: (Document.pdf, Page N).
  • If the retrieved context does not support an answer, the agent returns EXACTLY:
        Not covered by policy.
  • The model is instructed to never use outside knowledge and never guess.

The grounding instructions live in the system prompt; the retrieved chunks are passed
as labeled SOURCES so the model can only cite real (document, page) pairs.

Run interactively:
    python app/employee_agent.py
    python app/employee_agent.py "How many sick days require a medical certificate?"
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass

try:
    from ..clients import get_openai_client
    from ..config import settings
    from ..search.hybrid_search import RetrievedChunk, hybrid_search
except ImportError:  # pragma: no cover
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    from clients import get_openai_client  # type: ignore
    from config import settings  # type: ignore
    from search.hybrid_search import RetrievedChunk, hybrid_search  # type: ignore

REFUSAL = "Not covered by policy."

SYSTEM_PROMPT = """\
You are the Contoso HR Policy Assistant. You answer employee questions using ONLY the \
policy excerpts provided to you in the SOURCES section. You are a compliance-critical \
system and must follow these rules without exception:

1. GROUNDING: Use ONLY the information in SOURCES. Never use outside or general \
   knowledge. Never guess, infer beyond the text, or fabricate details.

2. CITATIONS: Every factual sentence MUST end with an inline citation in the exact \
   format (Document Name.pdf, Page N), using only the document names and page numbers \
   shown in SOURCES. Do NOT place a single citation only at the end of the answer — \
   each factual sentence needs its own citation. If one sentence draws on two sources, \
   include both citations.

3. REFUSAL: If the SOURCES do not contain enough information to answer the question, \
   respond with EXACTLY this text and nothing else:
   Not covered by policy.

4. STYLE: Be concise and factual. Do not add disclaimers, opinions, or content not \
   grounded in SOURCES.
"""

USER_TEMPLATE = """\
QUESTION:
{question}

SOURCES:
{sources}

Answer the question following all rules. Remember: cite every factual sentence with \
(Document Name.pdf, Page N), or respond exactly "Not covered by policy." if the \
sources are insufficient.
"""

# Matches citations like (Employee Handbook.pdf, Page 3)
CITATION_RE = re.compile(r"\(([^()]+?\.pdf),\s*Page\s+(\d+)\)", re.IGNORECASE)


@dataclass
class AgentResponse:
    question: str
    answer: str
    refused: bool
    chunks: list[RetrievedChunk]
    citations: list[tuple[str, int]]


def _format_sources(chunks: list[RetrievedChunk]) -> str:
    blocks = []
    for i, c in enumerate(chunks, 1):
        blocks.append(
            f"[Source {i}] Document: {c.document_name} | Page: {c.page_number} | "
            f"Section: {c.policy_section}\n{c.chunk_text}"
        )
    return "\n\n".join(blocks)


def _extract_citations(text: str) -> list[tuple[str, int]]:
    return [(m.group(1).strip(), int(m.group(2))) for m in CITATION_RE.finditer(text)]


def _validate_against_sources(
    citations: list[tuple[str, int]], chunks: list[RetrievedChunk]
) -> bool:
    """Guardrail: every cited (doc, page) must actually appear in the retrieved chunks."""
    allowed = {(c.document_name.lower(), c.page_number) for c in chunks}
    return all((doc.lower(), page) in allowed for doc, page in citations)


def answer_question(question: str, top_k: int | None = None) -> AgentResponse:
    top_k = top_k or settings.top_k
    chunks = hybrid_search(question, top_k=top_k)

    # No retrieval → immediate refusal, no model call.
    if not chunks:
        return AgentResponse(question, REFUSAL, True, [], [])

    client = get_openai_client()
    completion = client.chat.completions.create(
        model=settings.chat_deployment,
        temperature=0,            # deterministic, reduces hallucination risk
        top_p=1,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": USER_TEMPLATE.format(
                    question=question, sources=_format_sources(chunks)
                ),
            },
        ],
    )
    raw = (completion.choices[0].message.content or "").strip()

    # Normalize/refusal detection.
    if raw.lower().startswith("not covered by policy"):
        return AgentResponse(question, REFUSAL, True, chunks, [])

    citations = _extract_citations(raw)

    # Compliance guardrails: must have at least one citation AND all must be real.
    if not citations or not _validate_against_sources(citations, chunks):
        # Fail closed — never surface an ungrounded or fabricated-citation answer.
        return AgentResponse(question, REFUSAL, True, chunks, [])

    return AgentResponse(question, raw, False, chunks, citations)


def _print(resp: AgentResponse) -> None:
    print("\n" + "=" * 70)
    print(f"Q: {resp.question}")
    print("-" * 70)
    print(resp.answer)
    if not resp.refused:
        print("-" * 70)
        print(f"Citations: {len(resp.citations)} | "
              f"Retrieved chunks: {len(resp.chunks)}")
    print("=" * 70 + "\n")


def main() -> None:
    if len(sys.argv) > 1:
        _print(answer_question(" ".join(sys.argv[1:])))
        return

    print("Contoso HR Policy Assistant — type a question (Ctrl+C to exit).")
    try:
        while True:
            q = input("\nYou: ").strip()
            if not q:
                continue
            _print(answer_question(q))
    except (KeyboardInterrupt, EOFError):
        print("\nGoodbye.")


if __name__ == "__main__":
    main()
