from collections import defaultdict, deque
from datetime import UTC, datetime, timedelta


class LoginRateLimiter:
    def __init__(self, *, max_attempts: int = 5, window_seconds: int = 300) -> None:
        self.max_attempts = max_attempts
        self.window = timedelta(seconds=window_seconds)
        self._attempts: dict[str, deque[datetime]] = defaultdict(deque)

    def is_limited(self, key: str) -> bool:
        now = datetime.now(UTC)
        bucket = self._attempts[key]
        while bucket and now - bucket[0] > self.window:
            bucket.popleft()
        return len(bucket) >= self.max_attempts

    def register_failure(self, key: str) -> None:
        bucket = self._attempts[key]
        bucket.append(datetime.now(UTC))

    def reset(self, key: str) -> None:
        self._attempts.pop(key, None)
