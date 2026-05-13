from pydantic import BaseModel, Field


class OracleEnvironment(BaseModel):
    id: str
    name: str
    envType: str = Field(description="DEV | TEST | UAT | PROD")
    podUrl: str


class BusinessUnit(BaseModel):
    id: str
    code: str
    name: str
    country: str
    environmentId: str


class Ledger(BaseModel):
    id: str
    name: str
    currency: str
    environmentId: str


class Supplier(BaseModel):
    id: str
    number: str
    name: str
    environmentId: str


class Customer(BaseModel):
    id: str
    number: str
    name: str
    environmentId: str


class LegalEntity(BaseModel):
    id: str
    name: str
    country: str
    environmentId: str
