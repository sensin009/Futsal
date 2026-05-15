from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.team import Team
from app.schemas.teams import TeamCreate, TeamOut, TeamUpdate
from app.models.user import User

router = APIRouter(prefix="/admin/teams", tags=["admin-teams"])


@router.get("", response_model=list[TeamOut])
def list_teams(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Team).order_by(Team.points.desc(), Team.team_name.asc()).all()


@router.post("", response_model=TeamOut)
def create_team(payload: TeamCreate, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    existing = db.query(Team).filter(Team.team_name == payload.team_name).one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Team already exists")
    team = Team(team_name=payload.team_name, logo=payload.logo)
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@router.patch("/{team_id}", response_model=TeamOut)
def update_team(
    team_id: int,
    payload: TeamUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    team = db.query(Team).filter(Team.id == team_id).one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(team, field, value)

    db.commit()
    db.refresh(team)
    return team


@router.delete("/{team_id}", response_model=dict)
def delete_team(team_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    team = db.query(Team).filter(Team.id == team_id).one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    db.delete(team)
    db.commit()
    return {"ok": True}


@router.get("/{team_id}/players", response_model=list[dict])
def get_team_players(team_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    from app.models.player_profile import PlayerProfile
    rows = db.query(User).join(PlayerProfile).filter(PlayerProfile.team_id == team_id).all()
    return [{"id": u.id, "name": u.name, "photo": u.photo} for u in rows]

