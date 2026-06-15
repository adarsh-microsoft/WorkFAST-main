import json
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak
)
from xml.sax.saxutils import escape

with open("ai103-questions.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("ai103-questions-supplement.json", "r", encoding="utf-8") as f:
    supp = json.load(f)

items = data["items"]
supp_items = supp["items"]
LETTERS = ["A", "B", "C", "D", "E", "F"]

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleX", parent=styles["Title"], fontSize=22, leading=26,
    textColor=HexColor("#1a3c6e"), spaceAfter=6, alignment=TA_CENTER,
)
subtitle_style = ParagraphStyle(
    "Sub", parent=styles["Normal"], fontSize=11, leading=15,
    textColor=HexColor("#555555"), alignment=TA_CENTER, spaceAfter=4,
)
qnum_style = ParagraphStyle(
    "QNum", parent=styles["Normal"], fontSize=11, leading=15,
    textColor=HexColor("#1a3c6e"), fontName="Helvetica-Bold", spaceBefore=10,
)
question_style = ParagraphStyle(
    "Q", parent=styles["Normal"], fontSize=11, leading=15,
    fontName="Helvetica-Bold", spaceAfter=4,
)
opt_style = ParagraphStyle(
    "Opt", parent=styles["Normal"], fontSize=10, leading=14,
    leftIndent=14, spaceAfter=1,
)
correct_style = ParagraphStyle(
    "Correct", parent=styles["Normal"], fontSize=10, leading=14,
    leftIndent=14, spaceAfter=1, textColor=HexColor("#1b7a34"),
    fontName="Helvetica-Bold", backColor=HexColor("#e3f5e8"),
)
ans_style = ParagraphStyle(
    "Ans", parent=styles["Normal"], fontSize=10, leading=14,
    textColor=HexColor("#1b7a34"), fontName="Helvetica-Bold", spaceBefore=3,
)
expl_style = ParagraphStyle(
    "Expl", parent=styles["Normal"], fontSize=9.5, leading=13,
    textColor=HexColor("#333333"), leftIndent=6, spaceAfter=2,
)
source_style = ParagraphStyle(
    "Source", parent=styles["Normal"], fontSize=8.5, leading=11,
    textColor=HexColor("#777777"), leftIndent=6, spaceAfter=2,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Title"], fontSize=16, leading=20,
    textColor=HexColor("#1a3c6e"), spaceBefore=8, spaceAfter=4,
    alignment=TA_CENTER,
)
section_note_style = ParagraphStyle(
    "SectionNote", parent=styles["Normal"], fontSize=9, leading=12.5,
    textColor=HexColor("#555555"), spaceAfter=4,
)


def render_question(idx, it, show_source=False):
    block = []
    block.append(Paragraph(f"Question {idx}", qnum_style))
    block.append(Paragraph(esc(it["question"]), question_style))
    correct = it["correctAnswer"]
    for oi, opt in enumerate(it["options"]):
        opt_letter = LETTERS[oi] if oi < len(LETTERS) else str(oi)
        if oi == correct:
            block.append(Paragraph(
                f"&#10003; <b>{opt_letter}.</b> {esc(opt)}", correct_style))
        else:
            block.append(Paragraph(f"{opt_letter}. {esc(opt)}", opt_style))
    correct_letter = LETTERS[correct] if correct < len(LETTERS) else str(correct)
    block.append(Paragraph(
        f"Correct Answer: {correct_letter}. {esc(it['options'][correct])}", ans_style))
    block.append(Paragraph(f"<i>Explanation:</i> {esc(it['explanation'])}", expl_style))
    if show_source and it.get("source"):
        block.append(Paragraph(f"Source: {esc(it['source'])}", source_style))
    block.append(Spacer(1, 4))
    block.append(HRFlowable(width="100%", thickness=0.4, color=HexColor("#dddddd")))
    return block


def esc(s):
    return escape(str(s))


story = []
story.append(Paragraph("AI-103 Practice Exam — Answer Key", title_style))
story.append(Paragraph(
    "Microsoft Certified: Azure AI App and Agent Developer Associate", subtitle_style))
story.append(Paragraph(
    "113 Practice Questions with Correct Answers &amp; Explanations", subtitle_style))
story.append(Paragraph(
    "Sources: open-exam-prep.com + community exam-prep sites (CertyIQ, Pass4Success, ITExams)",
    subtitle_style))
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=1, color=HexColor("#1a3c6e")))
story.append(Spacer(1, 6))

story.append(Paragraph("Section 1 \u2014 Practice Questions (open-exam-prep.com)", section_style))
story.append(Spacer(1, 4))
for idx, it in enumerate(items, start=1):
    story.extend(render_question(idx, it))

story.append(PageBreak())
story.append(Paragraph(
    "Section 2 \u2014 Additional AI-103 Questions (Community Exam-Prep Sources)", section_style))
story.append(Paragraph(esc(supp["note"]), section_note_style))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=1, color=HexColor("#1a3c6e")))
story.append(Spacer(1, 6))
for j, it in enumerate(supp_items, start=1):
    story.extend(render_question(j, it, show_source=True))

doc = SimpleDocTemplate(
    "AI-103_Practice_Exam_Answers.pdf",
    pagesize=letter,
    topMargin=0.6 * inch,
    bottomMargin=0.6 * inch,
    leftMargin=0.7 * inch,
    rightMargin=0.7 * inch,
)
doc.title = "AI-103 Practice Exam Answer Key"
doc.build(story)
print(f"PDF generated: {len(items)} practice questions + {len(supp_items)} additional = {len(items) + len(supp_items)} total.")
