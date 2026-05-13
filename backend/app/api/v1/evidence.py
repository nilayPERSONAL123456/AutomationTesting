from fastapi import APIRouter, HTTPException

from app.mock.fixtures import RUNS
from app.schemas import Evidence

router = APIRouter()


@router.get("/run/{run_id}", response_model=list[Evidence])
async def evidence_for_run(run_id: str) -> list[Evidence]:
    for r in RUNS:
        if r.id == run_id:
            return r.evidence
    raise HTTPException(status_code=404, detail="Run not found")
