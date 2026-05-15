from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, aliased

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.match import Match
from app.models.match_player_score import MatchPlayerScore
from app.models.team import Team
from app.models.user import User
from app.schemas.users import UserOut

router = APIRouter(prefix="/me", tags=["me"])


@router.get("/account", response_model=UserOut)
def my_account(user: User = Depends(get_current_user)):
    return user


@router.get("/match-scores")
def my_match_scores(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    Ta = aliased(Team)
    Tb = aliased(Team)
    rows = (
        db.query(MatchPlayerScore, Match, Ta.team_name, Tb.team_name)
        .join(Match, Match.id == MatchPlayerScore.match_id)
        .join(Ta, Ta.id == Match.team_a_id)
        .join(Tb, Tb.id == Match.team_b_id)
        .filter(MatchPlayerScore.player_id == user.id)
        .order_by(Match.match_date.desc())
        .all()
    )
    return [
        {
            "match_id": m.id,
            "match_date": m.match_date,
            "venue": m.venue,
            "status": m.status,
            "team_a_name": na,
            "team_b_name": nb,
            "team_a_score": m.team_a_score,
            "team_b_score": m.team_b_score,
            "goals": s.goals,
            "assists": s.assists,
            "yellow_card": s.yellow_card,
            "red_card": s.red_card,
            "performance_rating": s.performance_rating,
        }
        for s, m, na, nb in rows
    ]


@router.post("/match-scores/{match_id}/report")
def report_my_performance(
    match_id: int,
    payload: dict, # { "event_type": "goal" | "assist", "minute": int }
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from app.services.match_events import add_match_event
    from app.schemas.matches import MatchEventCreate
    
    # Simple validation: user must have a team
    if not user.team_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="You must be assigned to a team to report scores")

    event = MatchEventCreate(
        team_id=user.team_id,
        player_id=user.id,
        event_type=payload.get("event_type", "goal"),
        minute=payload.get("minute", 0)
    )
    
    try:
        res = add_match_event(db, match_id, event)
        return res
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))
