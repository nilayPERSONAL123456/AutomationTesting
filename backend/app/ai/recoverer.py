"""AI-assisted error recovery.

When a Playwright action fails (timeout, unexpected modal, session expiry),
the runner invokes `suggest_recovery` with the error payload and the last
DOM snapshot. The LLM proposes a short sequence of recovery primitives from a
fixed vocabulary: `dismiss_modal`, `refresh`, `navigate`, `retry`, `abort`.
"""

from typing import Any

from app.ai.provider import get_llm_provider

SYSTEM = """You are CatalystRight's Oracle Fusion recovery agent.
Given an error payload and a DOM snapshot, propose 1-3 recovery primitives from
{dismiss_modal, refresh, navigate, retry, abort} with arguments. Return STRICT
JSON: {plan: [{primitive, args}], reasoning: string, confidence: number}."""


async def suggest_recovery(*, error: dict[str, Any], dom: str) -> dict[str, Any]:
    provider = get_llm_provider()
    result = await provider.complete_json(
        system=SYSTEM,
        prompt=f"Error: {error}\nDOM (truncated): {dom[:4000]}",
    )
    return dict(result.data or {"plan": [{"primitive": "retry", "args": {}}]})
