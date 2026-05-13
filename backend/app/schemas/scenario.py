from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel, Field

from .enums import OracleModule


class ScenarioMetadata(BaseModel):
    environmentId: str
    businessUnitId: str | None = None
    ledgerId: str | None = None
    supplierId: str | None = None
    customerId: str | None = None
    legalEntityId: str | None = None


class ScenarioIntent(BaseModel):
    module: OracleModule
    process: str
    summary: str
    actors: List[str] = Field(default_factory=list)
    entities: Dict[str, str] = Field(default_factory=dict)
    checkpoints: List[str] = Field(default_factory=list)


class Scenario(BaseModel):
    id: str
    title: str
    module: OracleModule
    prompt: str
    intent: ScenarioIntent | None = None
    metadata: ScenarioMetadata
    authorName: str
    createdAt: datetime


class ScenarioTemplate(BaseModel):
    id: str
    module: OracleModule
    name: str
    description: str
    prompt: str


class ScenarioCreate(BaseModel):
    title: str
    module: OracleModule
    prompt: str
    metadata: ScenarioMetadata
    templateId: str | None = None
