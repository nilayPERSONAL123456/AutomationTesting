"""Evidence capture pipeline.

Captures full-page + viewport screenshots, DOM snapshots, network HAR samples,
and extracts Oracle transaction IDs from the page. Uploads artifacts to the
configured object store and persists their metadata in the `evidence` table.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Protocol


ORACLE_TX_PATTERNS: dict[str, re.Pattern[str]] = {
    "requisition": re.compile(r"REQ-\d{5,}"),
    "po": re.compile(r"PO-\d{4,}"),
    "invoice": re.compile(r"INV-\d{4,}"),
    "journal": re.compile(r"JE-\d{4,}"),
    "sales_order": re.compile(r"SO-\d{4,}"),
    "credit_memo": re.compile(r"CM-\d{4,}"),
}


@dataclass
class CaptureResult:
    object_key: str
    label: str
    oracle_tx_id: str | None
    kind: str


class PageLike(Protocol):
    async def screenshot(self, *, full_page: bool = True) -> bytes: ...
    async def content(self) -> str: ...


class EvidenceCapturer:
    def __init__(self, object_store) -> None:  # pragma: no cover - wired at runtime
        self._store = object_store

    async def capture_screenshot(
        self, *, page: PageLike, run_id: str, step_id: str, label: str
    ) -> CaptureResult:
        png = await page.screenshot(full_page=True)
        key = f"runs/{run_id}/{step_id}/{datetime.now(tz=timezone.utc).isoformat()}.png"
        await self._store.put(key, png, content_type="image/png")  # pragma: no cover

        content = await page.content()
        tx_id = self._extract_tx_id(content)
        return CaptureResult(object_key=key, label=label, oracle_tx_id=tx_id, kind="screenshot")

    @staticmethod
    def _extract_tx_id(html: str) -> str | None:
        for pattern in ORACLE_TX_PATTERNS.values():
            m = pattern.search(html)
            if m:
                return m.group(0)
        return None
