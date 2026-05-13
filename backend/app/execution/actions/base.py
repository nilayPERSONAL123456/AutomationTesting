"""Base classes for the Oracle Fusion action library.

Every high-level Oracle action (e.g. `proc.createRequisition`) is implemented
as a subclass of `OracleAction`. Actions are pure: they receive a context
(browser page, evidence sink, metadata) and mutate it. They emit structured
events via the event bus.

The registry is the single source of truth that maps `oracleAction` identifiers
used in process graphs to concrete implementations.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from app.schemas.run import ProcessNode


class OracleAction(ABC):
    #: dotted identifier, e.g. "proc.createRequisition"
    action_id: str = ""

    @abstractmethod
    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None: ...


class _NoopAction(OracleAction):
    """Fallback for prototype execution without Playwright attached."""

    def __init__(self, action_id: str) -> None:
        self.action_id = action_id

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        # Simulated work with deterministic success for the prototype.
        return None


class ActionRegistry:
    def __init__(self) -> None:
        self._registry: dict[str, OracleAction] = {}

    def register(self, action: OracleAction) -> None:
        self._registry[action.action_id] = action

    def resolve(self, action_id: str) -> OracleAction:
        if action_id in self._registry:
            return self._registry[action_id]
        # In production we would fail fast; during prototype we fall back.
        return _NoopAction(action_id)


def default_registry() -> ActionRegistry:
    from app.execution.actions import (  # noqa: WPS433
        general_ledger,
        hcm,
        order_mgmt,
        payables,
        procurement,
        purchase_order,
        receivables,
        receiving,
    )

    registry = ActionRegistry()
    for mod in (
        procurement,
        purchase_order,
        receiving,
        payables,
        order_mgmt,
        receivables,
        general_ledger,
        hcm,
    ):
        for cls in mod.ACTIONS:
            registry.register(cls())
    return registry
