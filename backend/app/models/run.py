import uuid
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.schemas.enums import EventLevel, EventSource, RunStatus, StepStatus


class Run(Base):
    __tablename__ = "run"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenant.id", ondelete="CASCADE"))
    scenario_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scenario.id", ondelete="CASCADE"))
    environment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("oracle_environment.id"))
    triggered_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("app_user.id", ondelete="SET NULL")
    )
    status: Mapped[RunStatus] = mapped_column(
        Enum(RunStatus, name="run_status"), default=RunStatus.DRAFT, nullable=False
    )
    process_graph: Mapped[dict] = mapped_column(JSONB, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    confidence: Mapped[float | None] = mapped_column(Numeric(4, 3))
    summary: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class RunStep(Base):
    __tablename__ = "run_step"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("run.id", ondelete="CASCADE"))
    node_id: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    oracle_action: Mapped[str] = mapped_column(String(128), nullable=False)
    depends_on: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, server_default="{}")
    status: Mapped[StepStatus] = mapped_column(
        Enum(StepStatus, name="step_status"), default=StepStatus.PENDING, nullable=False
    )
    attempt: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    input: Mapped[dict] = mapped_column(JSONB, default=dict, server_default="{}")
    output: Mapped[dict | None] = mapped_column(JSONB)
    error: Mapped[dict | None] = mapped_column(JSONB)


class RunEvent(Base):
    __tablename__ = "run_event"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("run.id", ondelete="CASCADE"))
    step_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("run_step.id", ondelete="CASCADE"))
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    level: Mapped[EventLevel] = mapped_column(Enum(EventLevel, name="event_level"))
    source: Mapped[EventSource] = mapped_column(Enum(EventSource, name="event_source"))
    message: Mapped[str] = mapped_column(Text, nullable=False)
    payload: Mapped[dict | None] = mapped_column(JSONB)
