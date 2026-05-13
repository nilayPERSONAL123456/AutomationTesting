"""Purchase Order actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class AutoCreatePO(OracleAction):
    action_id = "po.autoCreate"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class CommunicatePO(OracleAction):
    action_id = "po.communicate"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class CancelPO(OracleAction):
    action_id = "po.cancel"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


ACTIONS = [AutoCreatePO, CommunicatePO, CancelPO]
