# from collections import deque
# from datetime import datetime, timezone
# from itertools import count
# from threading import Lock
# from typing import Optional

# from model import EstimatorRequest, HistoryEntry

# MAX_ENTRIES = 100

# _entries: deque[HistoryEntry] = deque(maxlen=MAX_ENTRIES)
# _ids = count(1)
# _lock = Lock()


# def add_entry(request: EstimatorRequest, predicted_price: float, predicted_price_usd: str) -> HistoryEntry:
#     with _lock:
#         entry = HistoryEntry(
#             id=next(_ids),
#             timestamp=datetime.now(timezone.utc),
#             request=request,
#             predicted_price=predicted_price,
#             predicted_price_usd=predicted_price_usd,
#         )
#         _entries.append(entry)
#         return entry


# def query(
#     limit: int = 10,
#     offset: int = 0,
#     since: Optional[datetime] = None,
#     until: Optional[datetime] = None,
#     min_price: Optional[float] = None,
#     max_price: Optional[float] = None,
# ) -> tuple[int, list[HistoryEntry]]:
#     with _lock:
#         matches = [
#             e for e in reversed(_entries)
#             if (since is None or e.timestamp >= since)
#             and (until is None or e.timestamp <= until)
#             and (min_price is None or e.predicted_price >= min_price)
#             and (max_price is None or e.predicted_price <= max_price)
#         ]
#     return len(matches), matches[offset:offset + limit]
