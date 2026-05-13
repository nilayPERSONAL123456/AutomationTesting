from app.ai.provider import get_llm_provider
from app.schemas.enums import OracleModule
from app.schemas.scenario import ScenarioIntent

SYSTEM = """You are CatalystRight's Oracle Fusion intent parser.
Given a plain-English business scenario, extract the Oracle module, process name,
actors, entities (BU, ledger, supplier, customer, amounts, currency), and the
observable checkpoints that must be validated. Return STRICT JSON matching the
provided schema."""


async def parse_intent(*, prompt: str, module: OracleModule) -> ScenarioIntent:
    provider = get_llm_provider()
    result = await provider.complete_json(
        system=SYSTEM,
        prompt=f"Module hint: {module.value}\nScenario:\n{prompt}",
    )
    data = dict(result.data)
    data["module"] = module  # trust the user-declared module
    return ScenarioIntent.model_validate(data)
