import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws/runs/{run_id}")
async def run_events_ws(ws: WebSocket, run_id: str) -> None:
    """Live stream of run events.

    In production this subscribes to Redis pubsub channel `run:{run_id}:events`.
    For the prototype, it emits a heartbeat so the UI can demo the live channel.
    """
    await ws.accept()
    try:
        i = 0
        while True:
            await ws.send_json(
                {
                    "type": "heartbeat",
                    "runId": run_id,
                    "ts": datetime.now(tz=timezone.utc).isoformat(),
                    "tick": i,
                }
            )
            i += 1
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        return
