from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.player_profile import PlayerProfile
from app.models.user import User
from app.schemas.players import PlayerProfileOut, PlayerProfileUpsert

router = APIRouter(prefix="/me/player-profile", tags=["me"])


@router.get("", response_model=PlayerProfileOut | None)
def get_my_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(PlayerProfile).filter(PlayerProfile.user_id == user.id).one_or_none()


@router.put("", response_model=PlayerProfileOut)
def upsert_my_profile(
    payload: PlayerProfileUpsert,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == user.id).one_or_none()
    if profile is None:
        profile = PlayerProfile(user_id=user.id)
        db.add(profile)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

