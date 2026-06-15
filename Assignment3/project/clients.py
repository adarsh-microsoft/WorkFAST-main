"""
clients.py
──────────
Factory functions for Azure OpenAI and Azure AI Search clients.

All clients are built from `settings` (environment-driven). Embedding generation is
wrapped with retry/backoff because Azure OpenAI can return transient 429/5xx errors
under load.
"""

from __future__ import annotations

from functools import lru_cache

from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from openai import AzureOpenAI
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

try:
    from .config import settings
except ImportError:  # pragma: no cover
    from config import settings  # type: ignore


@lru_cache(maxsize=1)
def get_openai_client() -> AzureOpenAI:
    """Return a cached Azure OpenAI client (key-based auth from env)."""
    return AzureOpenAI(
        azure_endpoint=settings.aoai_endpoint,
        api_key=settings.aoai_api_key,
        api_version=settings.aoai_api_version,
    )


@lru_cache(maxsize=1)
def get_search_index_client() -> SearchIndexClient:
    """Return a cached client for index management (create/update/delete index)."""
    return SearchIndexClient(
        endpoint=settings.search_endpoint,
        credential=AzureKeyCredential(settings.search_api_key),
    )


@lru_cache(maxsize=1)
def get_search_client() -> SearchClient:
    """Return a cached client for document operations (upload/query)."""
    return SearchClient(
        endpoint=settings.search_endpoint,
        index_name=settings.index_name,
        credential=AzureKeyCredential(settings.search_api_key),
    )


@retry(
    reraise=True,
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry=retry_if_exception_type(Exception),
)
def embed_text(text: str) -> list[float]:
    """Generate a single embedding vector with retry/backoff."""
    client = get_openai_client()
    response = client.embeddings.create(
        model=settings.embedding_deployment,
        input=text,
        dimensions=settings.embedding_dimensions,
    )
    return response.data[0].embedding


@retry(
    reraise=True,
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry=retry_if_exception_type(Exception),
)
def embed_batch(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a batch of texts in a single API call (cost-efficient)."""
    client = get_openai_client()
    response = client.embeddings.create(
        model=settings.embedding_deployment,
        input=texts,
        dimensions=settings.embedding_dimensions,
    )
    # The API preserves input order.
    return [item.embedding for item in response.data]
