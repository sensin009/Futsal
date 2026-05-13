from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.enums import UserStatus
from app.models.player_profile import PlayerProfile
from app.models.user import User
from app.schemas.players import PlayerDirectoryEntry

router = APIRouter(prefix="/players", tags=["players"])


@router.get("", response_model=list[PlayerDirectoryEntry])
def list_approved_players(db: Session = Depends(get_db)):
    rows = (
        db.query(PlayerProfile, User.name)
        .join(User, PlayerProfile.user_id == User.id)
        .filter(User.status == UserStatus.approved)
        .order_by(PlayerProfile.total_goals.desc(), PlayerProfile.total_assists.desc())
        .all()
    )
    return [
        PlayerDirectoryEntry(
            user_id=p.user_id,
            name=name,
            photo=p.photo,
            age=p.age,
            position=p.position,
            jersey_number=p.jersey_number,
            total_goals=p.total_goals,
            total_assists=p.total_assists,
            total_matches=p.total_matches,
            yellow_cards=p.yellow_cards,
            red_cards=p.red_cards,
        )
        for p, name in rows
    ]

