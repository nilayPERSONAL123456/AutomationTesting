from app.ai.provider import get_llm_provider
from app.schemas.run import Evidence, Validation

SYSTEM = """You are CatalystRight's Oracle Fusion evidence validator.
Given a checkpoint description and the captured evidence payload (screenshots,
extracted values, transaction IDs, DOM snapshots), decide whether the
checkpoint PASSED or FAILED. Include a short human reasoning string. Return
STRICT JSON: {passed: bool, reasoning: string, expected?: string, actual?: string}.
"""


async def validate_checkpoint(
    *,
    check_name: str,
    evidence: list[Evidence],
    expected: str | None = None,
) -> Validation:
    provider = get_llm_provider()
    result = await provider.complete_json(
        system=SYSTEM,
        prompt=(
            f"Checkpoint: {check_name}\n"
            f"Expected: {expected or '—'}\n"
            f"Evidence: {[e.model_dump(mode='json') for e in evidence]}"
        ),
    )
    data = result.data or {}
    return Validation(
        id=f"val-{hash(check_name) & 0xFFFF:x}",
        checkName=check_name,
        passed=bool(data.get("passed", True)),
        expected=expected,
        actual=data.get("actual"),
        reasoning=data.get("reasoning"),
    )
