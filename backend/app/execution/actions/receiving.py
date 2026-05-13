"""Receiving actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class CreateReceipt(OracleAction):
    action_id = "recv.createReceipt"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class CorrectReceipt(OracleAction):
    action_id = "recv.correctReceipt"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class ReturnToSupplier(OracleAction):
    action_id = "recv.returnToSupplier"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


ACTIONS = [CreateReceipt, CorrectReceipt, ReturnToSupplier]
