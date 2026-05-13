"""HCM and Payroll actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class HireEmployee(OracleAction):
    action_id = "hcm.hireEmployee"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class AddAssignment(OracleAction):
    action_id = "hcm.addAssignment"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class RunPayroll(OracleAction):
    action_id = "pay.runPayroll"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


ACTIONS = [HireEmployee, AddAssignment, RunPayroll]
