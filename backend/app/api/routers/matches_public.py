from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, aliased

from app.db.session import get_db
from app.models.enums import MatchStatus
from app.models.match import Match
from app.models.team import Team

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("")
def list_matches(db: Session = Depends(get_db), status: str | None = None):
    Ta = aliased(Team)
    Tb = aliased(Team)
    q = (
        db.query(Match, Ta.team_name, Tb.team_name)
        .join(Ta, Ta.id == Match.team_a_id)
        .join(Tb, Tb.id == Match.team_b_id)
        .order_by(Match.match_date.asc())
    )
    if status:
        try:
            st = MatchStatus(status)
            q = q.filter(Match.status == st)
        except ValueError:
            pass
    rows = q.all()

    now = datetime.now(timezone.utc)
    return [
        {
            "id": m.id,
            "team_a_id": m.team_a_id,
            "team_b_id": m.team_b_id,
            "team_a_name": na,
            "team_b_name": nb,
            "match_date": m.match_date,
            "venue": m.venue,
            "team_a_score": m.team_a_score,
            "team_b_score": m.team_b_score,
            "status": m.status,
            "is_today": m.match_date.date() == now.date(),
        }
        for m, na, nb in rows
    ]


@router.get("/{match_id}")
def get_match_details(match_id: int, db: Session = Depends(get_db)):
    Ta = aliased(Team)
    Tb = aliased(Team)
    row = (
        db.query(Match, Ta.team_name.label("team_a_name"), Tb.team_name.label("team_b_name"))
        .join(Ta, Ta.id == Match.team_a_id)
        .join(Tb, Tb.id == Match.team_b_id)
        .filter(Match.id == match_id)
        .one_or_none()
    )
    if not row:
        return None
    
    match, na, nb = row
    
    # Manually populate names for MatchOut if using dict or property
    # Since we are returning a dict that matches MatchOut schema
    return {
        **match.__dict__,
        "team_a_name": na,
        "team_b_name": nb,
        "events": match.events
    }

