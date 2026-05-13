"""Accounts Receivable actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class CreateARInvoice(OracleAction):
    action_id = "ar.createInvoice"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class ApplyReceipt(OracleAction):
    action_id = "ar.applyReceipt"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class IssueCreditMemo(OracleAction):
    action_id = "ar.issueCreditMemo"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


ACTIONS = [CreateARInvoice, ApplyReceipt, IssueCreditMemo]
