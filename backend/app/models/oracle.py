import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class OracleEnvironment(Base):
    __tablename__ = "oracle_environment"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenant.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    pod_url: Mapped[str] = mapped_column(String(512), nullable=False)
    env_type: Mapped[str] = mapped_column(String(16), nullable=False)
    vault_ref: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class BusinessUnit(Base):
    __tablename__ = "business_unit"
    __table_args__ = (UniqueConstraint("environment_id", "code", name="uq_bu_env_code"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenant.id", ondelete="CASCADE"))
    environment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("oracle_environment.id", ondelete="CASCADE")
    )
    code: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str | None] = mapped_column(String(8))


class Ledger(Base):
    __tablename__ = "ledger"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenant.id", ondelete="CASCADE"))
    environment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("oracle_environment.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    currency: Mapped[str] = mapped_column(String(8), nullable=False)


class LegalEntity(Base):
    __tablename__ = "legal_entity"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenant.id", ondelete="CASCADE"))
    environment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("oracle_environment.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str | None] = mapped_column(String(8))


class Supplier(Base):
    __tablename__ = "supplier"
    __table_args__ = (UniqueConstraint("environment_id", "number", name="uq_supplier_env_num"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenant.id", ondelete="CASCADE"))
    environment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("oracle_environment.id", ondelete="CASCADE"))
    number: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)


class Customer(Base):
    __tablename__ = "customer"
    __table_args__ = (UniqueConstraint("environment_id", "number", name="uq_customer_env_num"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tenant.id", ondelete="CASCADE"))
    environment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("oracle_environment.id", ondelete="CASCADE"))
    number: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
