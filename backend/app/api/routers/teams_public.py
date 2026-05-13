from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.team import Team
from app.schemas.teams import TeamOut

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=list[TeamOut])
def list_teams_public(db: Session = Depends(get_db)):
    return db.query(Team).order_by(Team.team_name.asc()).all()
