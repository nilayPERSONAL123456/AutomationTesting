"""Retry policy.

Exponential backoff with jitter, capped attempts. On terminal failure the
policy consults the AI recoverer for a proposed recovery plan before giving up.
"""

from __future__ import annotations

import asyncio
import random
from dataclasses import dataclass


@dataclass
class RetryPolicy:
    max_attempts: int = 3
    base_delay: float = 0.8
    max_delay: float = 8.0

    async def backoff(self, attempt: int) -> None:
        delay = min(self.max_delay, self.base_delay * (2 ** (attempt - 1)))
        delay += random.random() * 0.3
        await asyncio.sleep(delay)
