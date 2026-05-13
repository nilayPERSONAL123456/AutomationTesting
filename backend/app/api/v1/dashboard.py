from fastapi import APIRouter

from app.mock.fixtures import DASHBOARD_KPIS, MODULE_DISTRIBUTION, TREND

router = APIRouter()


@router.get("/kpis")
async def kpis():
    return DASHBOARD_KPIS


@router.get("/trend")
async def trend():
    return TREND


@router.get("/modules")
async def modules():
    return MODULE_DISTRIBUTION
