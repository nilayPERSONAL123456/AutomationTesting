"""Provider-agnostic LLM abstraction.

Every AI call in CatalystRight goes through this abstraction. The planner,
intent parser, validator, recoverer, and summarizer all produce structured
JSON output. Raw free-text generation is intentionally not supported: this
preserves auditability and lets us version prompts and validation schemas.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Protocol

from app.config import get_settings


@dataclass
class LLMResult:
    data: Any
    prompt_tokens: int
    completion_tokens: int
    latency_ms: int
    model: str
    provider: str
    confidence: float | None = None


class LLMProvider(Protocol):
    async def complete_json(
        self,
        *,
        system: str,
        prompt: str,
        schema: dict | None = None,
        model: str | None = None,
    ) -> LLMResult: ...


class MockProvider:
    """Deterministic provider used in tests and demos.

    Returns hand-crafted structured responses keyed on the first line of the
    prompt. Useful for end-to-end orchestration without external dependencies.
    """

    async def complete_json(
        self,
        *,
        system: str,
        prompt: str,
        schema: dict | None = None,
        model: str | None = None,
    ) -> LLMResult:
        head = prompt.strip().splitlines()[0].lower()
        if "intent" in system.lower() or "parse" in head:
            data = {
                "module": "P2P",
                "process": "Procure-to-Pay complete cycle",
                "summary": "Autonomous mock parse of a P2P cycle scenario.",
                "actors": ["Requester", "Approver", "Buyer", "AP Clerk"],
                "entities": {"businessUnit": "Vision India BU"},
                "checkpoints": [
                    "Requisition created",
                    "PO auto-generated",
                    "Invoice matched",
                    "Payment posted",
                ],
            }
            return LLMResult(data=data, prompt_tokens=420, completion_tokens=180,
                             latency_ms=860, model="mock-parser-1", provider="mock",
                             confidence=0.92)
        if "plan" in system.lower():
            from app.mock.fixtures import sample_p2p_graph
            data = sample_p2p_graph().model_dump()
            return LLMResult(data=data, prompt_tokens=1820, completion_tokens=680,
                             latency_ms=2940, model="mock-planner-1", provider="mock",
                             confidence=0.90)
        return LLMResult(data={"ok": True}, prompt_tokens=10, completion_tokens=5,
                         latency_ms=100, model="mock-1", provider="mock")


class OpenAIProvider:
    """Thin OpenAI adapter.

    Implementations should use `response_format={'type': 'json_schema', ...}` to
    force JSON shape. Kept minimal here for prototype purposes.
    """

    def __init__(self, api_key: str | None) -> None:
        self._api_key = api_key

    async def complete_json(
        self,
        *,
        system: str,
        prompt: str,
        schema: dict | None = None,
        model: str | None = None,
    ) -> LLMResult:
        # Real implementation: call openai.responses.create(...) with JSON schema.
        # Intentionally delegating to the mock provider to keep the prototype
        # runnable offline.
        return await MockProvider().complete_json(
            system=system, prompt=prompt, schema=schema, model=model
        )


def get_llm_provider() -> LLMProvider:
    settings = get_settings()
    if settings.llm_provider == "openai":
        return OpenAIProvider(api_key=settings.openai_api_key)
    return MockProvider()


def dumps_json(obj: Any) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)
