from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.enums import UserStatus
from app.models.player_profile import PlayerProfile
from app.models.team import Team
from app.models.user import User

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("/top-scorers")
def top_scorers(db: Session = Depends(get_db), limit: int = 10):
    rows = (
        db.query(PlayerProfile, User.name)
        .join(User, PlayerProfile.user_id == User.id)
        .filter(User.status == UserStatus.approved)
        .order_by(PlayerProfile.total_goals.desc(), PlayerProfile.total_assists.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "user_id": r.user_id,
            "name": name,
            "goals": r.total_goals,
            "assists": r.total_assists,
            "position": r.position,
            "photo": r.photo,
        }
        for r, name in rows
    ]


@router.get("/teams")
def team_table(db: Session = Depends(get_db)):
    teams = db.query(Team).order_by(Team.points.desc(), (Team.goals_for - Team.goals_against).desc()).all()
    return [
        {
            "id": t.id,
            "team_name": t.team_name,
            "logo": t.logo,
            "points": t.points,
            "wins": t.wins,
            "draws": t.draws,
            "losses": t.losses,
            "goals_for": t.goals_for,
            "goals_against": t.goals_against,
            "goal_difference": t.goals_for - t.goals_against,
        }
        for t in teams
    ]

