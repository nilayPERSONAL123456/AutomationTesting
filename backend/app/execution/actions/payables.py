"""Accounts Payable actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class CreateInvoice(OracleAction):
    action_id = "ap.createInvoice"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class ValidateMatch(OracleAction):
    """3-way match validation: PO · Receipt · Invoice."""

    action_id = "ap.validateMatch"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class PayInvoice(OracleAction):
    action_id = "ap.payInvoice"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class CancelInvoice(OracleAction):
    action_id = "ap.cancelInvoice"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


ACTIONS = [CreateInvoice, ValidateMatch, PayInvoice, CancelInvoice]
