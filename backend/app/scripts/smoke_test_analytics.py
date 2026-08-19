#!/usr/bin/env python3
"""Quick smoke-test: call every analytics_service function and print results."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.analytics_service import get_all_analytics
import json

data = get_all_analytics()

for view, rows in data.items():
    print(f"\n{'='*60}")
    print(f"  {view}  ({len(rows)} row(s))")
    print(f"{'='*60}")
    for row in rows:
        print(json.dumps({k: str(v) for k, v in row.items()}, ensure_ascii=False))
