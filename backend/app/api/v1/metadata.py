from fastapi import APIRouter

from app.mock.fixtures import (
    BUSINESS_UNITS,
    CUSTOMERS,
    ENVIRONMENTS,
    LEDGERS,
    SUPPLIERS,
)

router = APIRouter()


@router.get("/environments")
async def environments():
    return ENVIRONMENTS


@router.get("/business-units")
async def business_units():
    return BUSINESS_UNITS


@router.get("/ledgers")
async def ledgers():
    return LEDGERS


@router.get("/suppliers")
async def suppliers():
    return SUPPLIERS


@router.get("/customers")
async def customers():
    return CUSTOMERS
