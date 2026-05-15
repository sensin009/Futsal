from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.match import Match
from app.models.team import Team
from app.models.user import User
from app.schemas.matches import MatchCreate, MatchOut, MatchUpdate, MatchEventCreate, MatchEventOut
from app.services.standings import recompute_team_standings
from app.services.match_events import add_match_event

router = APIRouter(prefix="/admin/matches", tags=["admin-matches"])


def _ensure_teams_exist(db: Session, team_a_id: int, team_b_id: int) -> None:
    if team_a_id == team_b_id:
        raise HTTPException(status_code=400, detail="Teams must be different")
    for team_id in (team_a_id, team_b_id):
        if not db.query(Team).filter(Team.id == team_id).one_or_none():
            raise HTTPException(status_code=400, detail=f"Team {team_id} does not exist")


@router.get("", response_model=list[MatchOut])
def list_matches(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    from sqlalchemy.orm import aliased
    Ta = aliased(Team)
    Tb = aliased(Team)
    rows = (
        db.query(Match, Ta.team_name.label("team_a_name"), Tb.team_name.label("team_b_name"))
        .join(Ta, Ta.id == Match.team_a_id)
        .join(Tb, Tb.id == Match.team_b_id)
        .order_by(Match.match_date.desc())
        .all()
    )
    res = []
    for m, na, nb in rows:
        m.team_a_name = na
        m.team_b_name = nb
        res.append(m)
    return res


@router.post("", response_model=MatchOut)
def create_match(payload: MatchCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    _ensure_teams_exist(db, payload.team_a_id, payload.team_b_id)
    match = Match(**payload.model_dump())
    db.add(match)
    db.commit()
    db.refresh(match)
    recompute_team_standings(db)
    db.commit()
    return match


@router.patch("/{match_id}", response_model=MatchOut)
def update_match(
    match_id: int,
    payload: MatchUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    match = db.query(Match).filter(Match.id == match_id).one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    data = payload.model_dump(exclude_unset=True)
    if "team_a_id" in data or "team_b_id" in data:
        _ensure_teams_exist(db, data.get("team_a_id", match.team_a_id), data.get("team_b_id", match.team_b_id))

    for field, value in data.items():
        setattr(match, field, value)

    recompute_team_standings(db)
    db.commit()
    db.refresh(match)
    return match


@router.delete("/{match_id}", response_model=dict)
def delete_match(match_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    match = db.query(Match).filter(Match.id == match_id).one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(match)
    recompute_team_standings(db)
    db.commit()
    return {"ok": True}


@router.post("/{match_id}/events", response_model=MatchEventOut)
def record_match_event(
    match_id: int,
    payload: MatchEventCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    try:
        return add_match_event(db, match_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

