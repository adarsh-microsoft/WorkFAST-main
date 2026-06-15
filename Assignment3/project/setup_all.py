"""
setup_all.py
────────────
One-shot bootstrap that runs the full pipeline end-to-end:

    1. Generate the dummy HR policy PDFs
    2. Create / update the Azure AI Search index
    3. Embed + upload all chunks
    4. Run the evaluation harness (citation correctness)
    5. Run the adversarial Hybrid-vs-Vector evaluation

Steps 2–5 require valid Azure credentials in `.env`. Step 1 runs offline.

Run:
    python setup_all.py            # full pipeline
    python setup_all.py --pdfs     # only generate PDFs (offline)
"""

from __future__ import annotations

import argparse


def main() -> None:
    parser = argparse.ArgumentParser(description="Bootstrap the Grounded Policy Q&A solution.")
    parser.add_argument("--pdfs", action="store_true", help="Only generate PDFs (offline).")
    args = parser.parse_args()

    print("[1/5] Generating HR policy PDFs...")
    from data.generate_pdfs import main as gen_pdfs
    gen_pdfs()

    if args.pdfs:
        print("Done (PDFs only).")
        return

    print("\n[2/5] Creating Azure AI Search index...")
    from ingestion.create_index import main as create_index
    create_index()

    print("\n[3/5] Embedding + uploading documents...")
    from ingestion.upload_documents import upload
    count = upload()
    print(f"  ✓ Uploaded {count} documents.")

    print("\n[4/5] Running citation-correctness evaluation...")
    from evaluation.run_eval import main as run_eval
    run_eval()

    print("\n[5/5] Running adversarial Hybrid-vs-Vector evaluation...")
    from evaluation.adversarial_eval import main as run_adv
    run_adv()

    print("\nAll steps complete. The Employee Agent is ready: python app/employee_agent.py")


if __name__ == "__main__":
    main()
