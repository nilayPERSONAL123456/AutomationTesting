from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status

from app.mock.fixtures import SCENARIOS, TEMPLATES
from app.schemas import Scenario, ScenarioTemplate
from app.schemas.scenario import ScenarioCreate
from app.ai.intent_parser import parse_intent

router = APIRouter()


@router.get("", response_model=list[Scenario])
async def list_scenarios() -> list[Scenario]:
    return SCENARIOS


@router.get("/templates", response_model=list[ScenarioTemplate])
async def list_templates() -> list[ScenarioTemplate]:
    return TEMPLATES


@router.get("/{scenario_id}", response_model=Scenario)
async def get_scenario(scenario_id: str) -> Scenario:
    for s in SCENARIOS:
        if s.id == scenario_id:
            return s
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found")


@router.post("", response_model=Scenario, status_code=status.HTTP_201_CREATED)
async def create_scenario(payload: ScenarioCreate) -> Scenario:
    """Persist a new scenario and synchronously parse its intent.

    The intent parser call is deliberately done here so the planner has
    immediate input when the run is enqueued. Heavy operations (planning,
    execution) happen asynchronously on a worker.
    """
    intent = await parse_intent(prompt=payload.prompt, module=payload.module)
    scenario = Scenario(
        id=f"scn-{uuid4().hex[:8]}",
        title=payload.title,
        module=payload.module,
        prompt=payload.prompt,
        intent=intent,
        metadata=payload.metadata,
        authorName="Current User",
        createdAt=datetime.now(tz=timezone.utc),
    )
    SCENARIOS.append(scenario)
    return scenario
