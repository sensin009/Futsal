from __future__ import annotations

"""
Dev helper: creates tables without Alembic.
Use Alembic for real migrations; this is just to get running fast.
"""

from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401


def main() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    main()

