"""Execution engine.

Implements the per-run state machine:

    PLANNED → RUNNING → (PASSED | FAILED | ABORTED)

and the per-step state machine:

    PENDING → RUNNING → (PASSED | FAILED | SKIPPED | RETRYING)

The engine is deliberately decoupled from the orchestrator (which persists and
dispatches) and the browser driver (which clicks through Oracle Fusion). The
engine walks the graph in topological order, respecting dependencies.
"""

from __future__ import annotations

from collections import defaultdict, deque
from datetime import datetime, timezone

from app.events import event_bus
from app.execution.actions.base import ActionRegistry
from app.execution.retry import RetryPolicy
from app.schemas.enums import EventLevel, EventSource, RunStatus, StepStatus
from app.schemas.run import ProcessGraph, Run


class ExecutionEngine:
    def __init__(self, registry: ActionRegistry, retry: RetryPolicy | None = None) -> None:
        self._registry = registry
        self._retry = retry or RetryPolicy()

    @staticmethod
    def _topological(graph: ProcessGraph) -> list[str]:
        indeg: dict[str, int] = defaultdict(int)
        adj: dict[str, list[str]] = defaultdict(list)
        for n in graph.nodes:
            indeg.setdefault(n.id, 0)
        for e in graph.edges:
            adj[e.source].append(e.target)
            indeg[e.target] += 1
        q = deque([nid for nid, d in indeg.items() if d == 0])
        order: list[str] = []
        while q:
            nid = q.popleft()
            order.append(nid)
            for nxt in adj[nid]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    q.append(nxt)
        return order

    async def run(self, run: Run, context: dict) -> Run:
        run.status = RunStatus.RUNNING
        await event_bus.publish(
            run_id=run.id,
            level=EventLevel.INFO,
            source=EventSource.SYSTEM,
            message=f"Run {run.id} started.",
        )
        order = self._topological(run.graph)
        nodes = {n.id: n for n in run.graph.nodes}
        failed = False
        for nid in order:
            node = nodes[nid]
            node.status = StepStatus.RUNNING
            await event_bus.publish(
                run_id=run.id,
                step_id=nid,
                level=EventLevel.INFO,
                source=EventSource.EXEC,
                message=f"Executing {node.oracleAction}",
            )
            try:
                action = self._registry.resolve(node.oracleAction)
                await action.execute(context=context, node=node)
                node.status = StepStatus.PASSED
                await event_bus.publish(
                    run_id=run.id,
                    step_id=nid,
                    level=EventLevel.INFO,
                    source=EventSource.EXEC,
                    message=f"{node.oracleAction} passed.",
                )
            except Exception as exc:  # noqa: BLE001
                node.status = StepStatus.FAILED
                failed = True
                await event_bus.publish(
                    run_id=run.id,
                    step_id=nid,
                    level=EventLevel.ERROR,
                    source=EventSource.EXEC,
                    message=f"{node.oracleAction} failed: {exc}",
                )
                break

        run.status = RunStatus.FAILED if failed else RunStatus.PASSED
        run.finishedAt = datetime.now(tz=timezone.utc)
        await event_bus.publish(
            run_id=run.id,
            level=EventLevel.INFO,
            source=EventSource.SYSTEM,
            message=f"Run {run.id} finished with status {run.status.value}.",
        )
        return run
