from fastapi import APIRouter

from app.api.v1 import (
    dashboard,
    evidence,
    metadata,
    runs,
    scenarios,
    ws,
)

api_router = APIRouter()
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["scenarios"])
api_router.include_router(runs.router, prefix="/runs", tags=["runs"])
api_router.include_router(evidence.router, prefix="/evidence", tags=["evidence"])
api_router.include_router(metadata.router, prefix="/metadata", tags=["metadata"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(ws.router, tags=["ws"])
