"""High-level run orchestrator.

Responsibilities:
- Acquire a Playwright browser + persisted Oracle session for the target pod.
- Build the execution context.
- Invoke the ExecutionEngine.
- On completion, invoke the AI validator over the captured evidence bundle.
- On terminal state, close the browser and package the report.
"""

from __future__ import annotations

from app.execution.actions.base import default_registry
from app.execution.engine import ExecutionEngine
from app.execution.retry import RetryPolicy
from app.schemas.run import Run


class Runner:
    def __init__(self) -> None:
        self._engine = ExecutionEngine(registry=default_registry(), retry=RetryPolicy())

    async def run(self, run: Run) -> Run:
        # production: await self._browser_pool.acquire(environment=...)
        context = {
            "browser": None,    # Playwright Browser
            "page": None,       # Playwright Page bound to Oracle Fusion
            "run": run,
            "evidence": [],
        }
        try:
            run = await self._engine.run(run, context)
        finally:
            # production: release browser, flush evidence, finalize report.
            pass
        return run
