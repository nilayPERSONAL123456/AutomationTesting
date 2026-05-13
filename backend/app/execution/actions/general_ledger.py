"""General Ledger actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class PostJournal(OracleAction):
    action_id = "gl.postJournal"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class ValidatePosting(OracleAction):
    action_id = "gl.validatePosting"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class ClosePeriod(OracleAction):
    action_id = "gl.closePeriod"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


ACTIONS = [PostJournal, ValidatePosting, ClosePeriod]
