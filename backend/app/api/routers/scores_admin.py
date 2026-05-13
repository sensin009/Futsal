from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.match import Match
from app.models.match_player_score import MatchPlayerScore
from app.models.user import User
from app.schemas.scores import MatchPlayerScoreOut, MatchPlayerScoreUpsert
from app.services.player_stats import recompute_player_profile_totals

router = APIRouter(prefix="/admin/matches/{match_id}/scores", tags=["admin-scores"])


@router.get("", response_model=list[MatchPlayerScoreOut])
def list_scores(match_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(MatchPlayerScore).filter(MatchPlayerScore.match_id == match_id).all()


@router.put("", response_model=MatchPlayerScoreOut)
def upsert_score(
    match_id: int,
    payload: MatchPlayerScoreUpsert,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    match = db.query(Match).filter(Match.id == match_id).one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    row = (
        db.query(MatchPlayerScore)
        .filter(MatchPlayerScore.match_id == match_id, MatchPlayerScore.player_id == payload.player_id)
        .one_or_none()
    )
    if row is None:
        row = MatchPlayerScore(match_id=match_id, player_id=payload.player_id)
        db.add(row)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, field, value)

    recompute_player_profile_totals(db, payload.player_id)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{score_id}", response_model=dict)
def delete_score(
    match_id: int,
    score_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    row = (
        db.query(MatchPlayerScore)
        .filter(MatchPlayerScore.id == score_id, MatchPlayerScore.match_id == match_id)
        .one_or_none()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Score row not found")
    player_id = row.player_id
    db.delete(row)
    recompute_player_profile_totals(db, player_id)
    db.commit()
    return {"ok": True}

