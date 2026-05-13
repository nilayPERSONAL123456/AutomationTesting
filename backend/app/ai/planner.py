from app.ai.provider import get_llm_provider
from app.schemas.run import ProcessGraph
from app.schemas.scenario import Scenario

SYSTEM = """You are CatalystRight's Oracle Fusion process planner.
Given a parsed scenario intent and resolved metadata, output a directed
execution graph of high-level Oracle actions. Each node must have a unique id,
a human label, an `oracleAction` identifier from the action library, a `kind`
(start | task | approval | validation | end), and a list of dependencies.
Include explicit validation checkpoints. Return STRICT JSON."""


async def build_process_graph(scenario: Scenario) -> ProcessGraph:
    provider = get_llm_provider()
    payload = {
        "title": scenario.title,
        "module": scenario.module.value,
        "intent": scenario.intent.model_dump() if scenario.intent else None,
        "metadata": scenario.metadata.model_dump(),
    }
    result = await provider.complete_json(
        system=SYSTEM,
        prompt=f"Compile an execution graph for:\n{payload}",
    )
    return ProcessGraph.model_validate(result.data)
