"""Procurement — requisition lifecycle actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class CreateRequisition(OracleAction):
    action_id = "proc.createRequisition"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        # page.goto("/procurement/requisitions/new")
        # fill form, save header, add lines, save...
        # capture screenshot: "Requisition created"
        return None


class SubmitRequisition(OracleAction):
    action_id = "proc.submitRequisition"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class ApproveRequisition(OracleAction):
    action_id = "proc.approveRequisition"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        # Switch session to approver, navigate to Worklist, approve...
        return None


ACTIONS = [CreateRequisition, SubmitRequisition, ApproveRequisition]
