"""
generate_pdfs.py
────────────────
Generates the three dummy HR policy PDFs from the shared `policy_corpus` module.

Each section in the corpus becomes its OWN page, so that page numbers in the PDF
match the page numbers stored as citation metadata in the search index. This exact
alignment is what makes "(Employee Handbook.pdf, Page 3)" citations verifiable.

Run:
    python data/generate_pdfs.py
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

# Support running both as a module and as a script.
try:
    from .policy_corpus import CORPUS, LAST_UPDATED
except ImportError:  # pragma: no cover - script execution fallback
    from policy_corpus import CORPUS, LAST_UPDATED  # type: ignore

OUTPUT_DIR = Path(__file__).resolve().parent


def _styles():
    base = getSampleStyleSheet()
    title = ParagraphStyle(
        "PolicyTitle",
        parent=base["Title"],
        fontSize=20,
        spaceAfter=18,
    )
    heading = ParagraphStyle(
        "SectionHeading",
        parent=base["Heading1"],
        fontSize=15,
        spaceBefore=6,
        spaceAfter=12,
        textColor="#1f3a5f",
    )
    body = ParagraphStyle(
        "PolicyBody",
        parent=base["BodyText"],
        fontSize=11,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=10,
    )
    meta = ParagraphStyle(
        "PolicyMeta",
        parent=base["Normal"],
        fontSize=8,
        textColor="#888888",
    )
    return title, heading, body, meta


def _filename(document_name: str) -> str:
    """Map display name to on-disk filename per the required project structure."""
    return document_name.replace(" ", "_")


def build_pdf(document_name: str, pages: list[dict]) -> Path:
    title_style, heading_style, body_style, meta_style = _styles()
    out_path = OUTPUT_DIR / _filename(document_name)

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=LETTER,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=1 * inch,
        bottomMargin=1 * inch,
        title=document_name,
        author="Contoso Ltd. Human Resources",
    )

    flow = []
    display_title = document_name.replace(".pdf", "")
    for idx, page in enumerate(pages, start=1):
        # Document title repeated as a light header context on each page.
        flow.append(Paragraph(display_title, meta_style))
        flow.append(Spacer(1, 6))
        if idx == 1:
            flow.append(Paragraph(display_title, title_style))
        flow.append(Paragraph(page["section"], heading_style))

        # Body: skip the first line (it repeats the section title in the corpus).
        body_text = page["text"].split("\n\n", 1)[-1]
        for para in body_text.split("\n\n"):
            flow.append(Paragraph(para.strip(), body_style))

        flow.append(Spacer(1, 18))
        flow.append(
            Paragraph(
                f"{document_name} &nbsp;|&nbsp; Page {idx} &nbsp;|&nbsp; "
                f"Last updated {LAST_UPDATED}",
                meta_style,
            )
        )
        if idx < len(pages):
            flow.append(PageBreak())

    doc.build(flow)
    return out_path


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for document_name, pages in CORPUS.items():
        path = build_pdf(document_name, pages)
        print(f"  ✓ Generated {path.name} ({len(pages)} pages)")
    print("All HR policy PDFs generated.")


if __name__ == "__main__":
    main()
