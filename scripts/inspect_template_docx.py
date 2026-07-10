"""Inspect the Co-Marketing approach-doc template structure (format only)."""
import sys
from docx import Document
from docx.oxml.ns import qn

path = r"c:\WorkFAST-main\generated-content\approach-documents\Approach Document - Co-Marketing v1.2.docx"
doc = Document(path)

print("=== SECTIONS ===")
for i, s in enumerate(doc.sections):
    print(f"Section {i}: page={s.page_width}x{s.page_height} "
          f"margins L{s.left_margin} R{s.right_margin} T{s.top_margin} B{s.bottom_margin} "
          f"start_type={s.start_type}")
    print(f"  header linked_to_prev={s.header.is_linked_to_previous}; "
          f"footer linked_to_prev={s.footer.is_linked_to_previous}")

print("\n=== BODY BLOCKS (paragraphs + tables in order) ===")
body = doc.element.body

def iter_block_items(parent):
    from docx.table import Table
    from docx.text.paragraph import Paragraph
    for child in parent.iterchildren():
        if child.tag == qn('w:p'):
            yield ('P', Paragraph(child, doc))
        elif child.tag == qn('w:tbl'):
            yield ('T', Table(child, doc))

pi = 0
for kind, block in iter_block_items(body):
    if kind == 'P':
        text = block.text
        style = block.style.name if block.style else None
        # detect page breaks
        brk = ''
        for run in block.runs:
            for br in run._element.findall(qn('w:br')):
                if br.get(qn('w:type')) == 'page':
                    brk += ' [PAGEBREAK]'
        for lr in block._p.findall('.//' + qn('w:lastRenderedPageBreak')):
            brk += ' [renderedPageBreak]'
        # detect section break (sectPr in pPr)
        sect = ''
        ppr = block._p.find(qn('w:pPr'))
        if ppr is not None and ppr.find(qn('w:sectPr')) is not None:
            sect = ' [SECTION BREAK]'
        marker = brk + sect
        print(f"[{pi:03d}] P  style='{style}'{marker}  :: {repr(text[:160])}")
    else:
        rows = len(block.rows)
        cols = len(block.columns)
        print(f"[{pi:03d}] TBL {rows}x{cols} style='{block.style.name if block.style else None}'")
        for r in block.rows[:3]:
            cells = [c.text[:30] for c in r.cells]
            print(f"        row: {cells}")
    pi += 1

print("\n=== STYLES USED (paragraph) ===")
used = {}
for p in doc.paragraphs:
    sn = p.style.name if p.style else None
    used[sn] = used.get(sn, 0) + 1
for k, v in sorted(used.items(), key=lambda x: -x[1]):
    print(f"  {k}: {v}")
