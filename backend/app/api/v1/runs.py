from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.ai.planner import build_process_graph
from app.mock.fixtures import RUNS, SCENARIOS
from app.schemas import Run
from app.schemas.enums import RunStatus

router = APIRouter()


class CreateRunBody(BaseModel):
    scenarioId: str
    environmentId: str


@router.get("", response_model=list[Run])
async def list_runs() -> list[Run]:
    return RUNS


@router.get("/{run_id}", response_model=Run)
async def get_run(run_id: str) -> Run:
    for r in RUNS:
        if r.id == run_id:
            return r
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")


@router.post("", response_model=Run, status_code=status.HTTP_201_CREATED)
async def create_run(body: CreateRunBody) -> Run:
    scenario = next((s for s in SCENARIOS if s.id == body.scenarioId), None)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    graph = await build_process_graph(scenario)
    run = Run(
        id=f"run-{uuid4().hex[:8]}",
        scenarioId=scenario.id,
        scenarioTitle=scenario.title,
        module=scenario.module,
        environmentName="Vision UAT",
        status=RunStatus.PLANNED,
        startedAt=datetime.now(tz=timezone.utc),
        triggeredBy="Current User",
        graph=graph,
        steps=graph.nodes,
        events=[],
        evidence=[],
        validations=[],
        aiCalls=[],
    )
    RUNS.append(run)
    # In production: enqueue on Redis for async worker pickup.
    return run


@router.post("/{run_id}/abort", response_model=Run)
async def abort_run(run_id: str) -> Run:
    for r in RUNS:
        if r.id == run_id:
            r.status = RunStatus.ABORTED
            r.finishedAt = datetime.now(tz=timezone.utc)
            return r
    raise HTTPException(status_code=404, detail="Run not found")
