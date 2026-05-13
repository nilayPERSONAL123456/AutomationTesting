import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Validation(Base):
    __tablename__ = "validation"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("run.id", ondelete="CASCADE"))
    step_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("run_step.id", ondelete="CASCADE"))
    check_name: Mapped[str] = mapped_column(String(255), nullable=False)
    expected: Mapped[dict | None] = mapped_column(JSONB)
    actual: Mapped[dict | None] = mapped_column(JSONB)
    passed: Mapped[bool] = mapped_column(Boolean, nullable=False)
    reasoning: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
