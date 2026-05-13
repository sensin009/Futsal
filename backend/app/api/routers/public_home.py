from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, aliased

from app.db.session import get_db
from app.models.enums import MatchStatus, UserStatus
from app.models.match import Match
from app.models.player_profile import PlayerProfile
from app.models.team import Team
from app.models.user import User

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/home")
def home_summary(db: Session = Depends(get_db)):
    Ta = aliased(Team)
    Tb = aliased(Team)

    def match_row(m: Match, na: str, nb: str) -> dict:
        return {
            "id": m.id,
            "team_a_name": na,
            "team_b_name": nb,
            "match_date": m.match_date,
            "venue": m.venue,
            "team_a_score": m.team_a_score,
            "team_b_score": m.team_b_score,
            "status": m.status,
        }

    upcoming = (
        db.query(Match, Ta.team_name, Tb.team_name)
        .join(Ta, Ta.id == Match.team_a_id)
        .join(Tb, Tb.id == Match.team_b_id)
        .filter(Match.status.in_([MatchStatus.upcoming, MatchStatus.live]))
        .order_by(Match.match_date.asc())
        .first()
    )
    upcoming_payload = None
    if upcoming:
        m, na, nb = upcoming
        upcoming_payload = match_row(m, na, nb)

    latest = (
        db.query(Match, Ta.team_name, Tb.team_name)
        .join(Ta, Ta.id == Match.team_a_id)
        .join(Tb, Tb.id == Match.team_b_id)
        .filter(Match.status == MatchStatus.finished)
        .order_by(Match.match_date.desc())
        .first()
    )
    latest_payload = None
    if latest:
        m, na, nb = latest
        latest_payload = match_row(m, na, nb)

    top_rows = (
        db.query(PlayerProfile, User.name)
        .join(User, PlayerProfile.user_id == User.id)
        .filter(User.status == UserStatus.approved)
        .order_by(PlayerProfile.total_goals.desc(), PlayerProfile.total_assists.desc())
        .limit(5)
        .all()
    )
    top_players = [
        {
            "user_id": p.user_id,
            "name": name,
            "goals": p.total_goals,
            "assists": p.total_assists,
            "photo": p.photo,
            "position": p.position,
        }
        for p, name in top_rows
    ]

    return {
        "upcoming_match": upcoming_payload,
        "latest_result": latest_payload,
        "top_players": top_players,
    }
