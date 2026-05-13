"""Order Management actions."""

from typing import Any

from app.execution.actions.base import OracleAction
from app.schemas.run import ProcessNode


class CreateSalesOrder(OracleAction):
    action_id = "om.createSalesOrder"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class ShipOrder(OracleAction):
    action_id = "om.shipOrder"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


class CloseOrder(OracleAction):
    action_id = "om.closeOrder"

    async def execute(self, *, context: dict[str, Any], node: ProcessNode) -> None:
        return None


ACTIONS = [CreateSalesOrder, ShipOrder, CloseOrder]
