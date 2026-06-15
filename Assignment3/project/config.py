"""
config.py
─────────
Centralized, environment-driven configuration for the Grounded Policy Q&A solution.

SECURITY: All secrets (API keys, endpoints) are read from environment variables.
Nothing is hardcoded. Load order:
    1. Process environment variables (highest priority)
    2. Values from a local `.env` file (via python-dotenv)

Import `settings` from this module everywhere instead of calling os.environ directly,
so configuration is validated once at startup.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

# Load `.env` if present (does NOT override variables already set in the real environment).
load_dotenv(override=False)

# Repository-relative paths -----------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent
DATA_DIR = PROJECT_ROOT / "data"
EVAL_DIR = PROJECT_ROOT / "evaluation"


def _require(name: str) -> str:
    """Return a required env var or raise a clear, actionable error."""
    value = os.environ.get(name, "").strip()
    if not value:
        raise EnvironmentError(
            f"Missing required environment variable: {name}. "
            f"Copy `.env.example` to `.env` and populate it, "
            f"or export {name} in your shell."
        )
    return value


def _optional(name: str, default: str) -> str:
    return os.environ.get(name, default).strip() or default


@dataclass(frozen=True)
class Settings:
    # ── Azure OpenAI ──────────────────────────────────────────────────────────
    aoai_endpoint: str = field(default_factory=lambda: _require("AZURE_OPENAI_ENDPOINT"))
    aoai_api_key: str = field(default_factory=lambda: _require("AZURE_OPENAI_API_KEY"))
    aoai_api_version: str = field(
        default_factory=lambda: _optional("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
    )
    chat_deployment: str = field(
        default_factory=lambda: _optional("AZURE_OPENAI_CHAT_DEPLOYMENT", "gpt-4o-mini")
    )
    embedding_deployment: str = field(
        default_factory=lambda: _optional(
            "AZURE_OPENAI_EMBEDDING_DEPLOYMENT", "text-embedding-3-large"
        )
    )
    embedding_dimensions: int = field(
        default_factory=lambda: int(_optional("AZURE_OPENAI_EMBEDDING_DIMENSIONS", "3072"))
    )

    # ── Azure AI Search ───────────────────────────────────────────────────────
    search_endpoint: str = field(default_factory=lambda: _require("AZURE_SEARCH_ENDPOINT"))
    search_api_key: str = field(default_factory=lambda: _require("AZURE_SEARCH_API_KEY"))
    index_name: str = field(
        default_factory=lambda: _optional("AZURE_SEARCH_INDEX_NAME", "hr-policy-index")
    )
    semantic_config: str = field(
        default_factory=lambda: _optional("AZURE_SEARCH_SEMANTIC_CONFIG", "hr-policy-semantic")
    )

    # ── Retrieval ─────────────────────────────────────────────────────────────
    top_k: int = field(default_factory=lambda: int(_optional("RETRIEVAL_TOP_K", "5")))


# Singleton — import this everywhere.
settings = Settings()
