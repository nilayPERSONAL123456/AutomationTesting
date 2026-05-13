from datetime import datetime
from typing import Any, Dict, List

from pydantic import BaseModel, Field

from .enums import EventLevel, EventSource, OracleModule, RunStatus, StepStatus


class ProcessNode(BaseModel):
    id: str
    label: str
    oracleAction: str
    kind: str  # start | task | approval | validation | end
    dependsOn: List[str] = Field(default_factory=list)
    status: StepStatus = StepStatus.PENDING
    durationMs: int | None = None


class ProcessEdge(BaseModel):
    id: str
    source: str
    target: str
    kind: str  # data | approval | validation


class ProcessGraph(BaseModel):
    nodes: List[ProcessNode]
    edges: List[ProcessEdge]


class RunEvent(BaseModel):
    id: str
    runId: str
    stepId: str | None = None
    ts: datetime
    level: EventLevel
    source: EventSource
    message: str
    payload: Dict[str, Any] | None = None


class Evidence(BaseModel):
    id: str
    stepId: str
    kind: str  # screenshot | transaction_id | value | dom | har
    oracleTxId: str | None = None
    label: str
    thumbnailUrl: str | None = None
    capturedAt: datetime


class Validation(BaseModel):
    id: str
    stepId: str | None = None
    checkName: str
    passed: bool
    expected: str | None = None
    actual: str | None = None
    reasoning: str | None = None


class AICall(BaseModel):
    id: str
    phase: str  # intent | plan | recover | validate | summarize
    provider: str
    model: str
    promptTokens: int = 0
    completionTokens: int = 0
    latencyMs: int = 0
    confidence: float | None = None
    createdAt: datetime


class Run(BaseModel):
    id: str
    scenarioId: str
    scenarioTitle: str
    module: OracleModule
    environmentName: str
    status: RunStatus
    startedAt: datetime | None = None
    finishedAt: datetime | None = None
    durationMs: int | None = None
    confidence: float | None = None
    summary: str | None = None
    triggeredBy: str
    graph: ProcessGraph
    steps: List[ProcessNode]
    events: List[RunEvent]
    evidence: List[Evidence]
    validations: List[Validation]
    aiCalls: List[AICall]
