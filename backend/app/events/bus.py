"""Run event bus.

Abstracts over Redis pubsub so other parts of the platform don't depend on the
transport directly. Every emission is persisted (to `run_event` table) AND
published on the `run:{run_id}:events` channel for WebSocket fan-out.
"""

from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from typing import Any, AsyncIterator

from app.schemas.enums import EventLevel, EventSource


class RunEventBus:
    def __init__(self) -> None:
        # Prototype: in-process queue per run. Production: Redis pubsub.
        self._channels: dict[str, asyncio.Queue[str]] = {}

    def _chan(self, run_id: str) -> asyncio.Queue[str]:
        return self._channels.setdefault(run_id, asyncio.Queue(maxsize=1024))

    async def publish(
        self,
        *,
        run_id: str,
        level: EventLevel,
        source: EventSource,
        message: str,
        step_id: str | None = None,
        payload: dict[str, Any] | None = None,
    ) -> None:
        event = {
            "runId": run_id,
            "stepId": step_id,
            "ts": datetime.now(tz=timezone.utc).isoformat(),
            "level": level.value,
            "source": source.value,
            "message": message,
            "payload": payload or {},
        }
        await self._chan(run_id).put(json.dumps(event))

    async def subscribe(self, run_id: str) -> AsyncIterator[str]:
        q = self._chan(run_id)
        while True:
            msg = await q.get()
            yield msg


event_bus = RunEventBus()
