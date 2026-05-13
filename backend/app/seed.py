from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.db.init_db import ensure_admin
from app.db.session import SessionLocal
from app.models.enums import MatchStatus, UserStatus
from app.models.match import Match
from app.models.team import Team
from app.models.user import User
from app.core.security import get_password_hash


def seed() -> None:
    db: Session = SessionLocal()
    try:
        ensure_admin(
            db,
            email=os.getenv("BOOTSTRAP_ADMIN_EMAIL", "admin@example.com"),
            password=os.getenv("BOOTSTRAP_ADMIN_PASSWORD", "admin12345"),
        )

        if not db.query(Team).count():
            t1 = Team(team_name="Green Strikers")
            t2 = Team(team_name="Navy United")
            db.add_all([t1, t2])
            db.commit()

        if not db.query(User).filter(User.email == "player1@example.com").one_or_none():
            p = User(
                name="Player One",
                email="player1@example.com",
                password_hash=get_password_hash("player12345"),
                status=UserStatus.approved,
            )
            db.add(p)
            db.commit()

        teams = db.query(Team).order_by(Team.id.asc()).all()
        if teams and not db.query(Match).count():
            match = Match(
                team_a_id=teams[0].id,
                team_b_id=teams[1].id,
                match_date=datetime.now(timezone.utc) + timedelta(days=2),
                venue="Main Futsal Court",
                status=MatchStatus.upcoming,
            )
            db.add(match)
            db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()

