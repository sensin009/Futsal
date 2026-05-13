from __future__ import annotations

from pydantic import BaseModel, Field


class TeamOut(BaseModel):
    id: int
    team_name: str
    logo: str | None
    points: int
    wins: int
    draws: int
    losses: int
    goals_for: int
    goals_against: int

    class Config:
        from_attributes = True


class TeamCreate(BaseModel):
    team_name: str = Field(min_length=2, max_length=120)
    logo: str | None = None


class TeamUpdate(BaseModel):
    team_name: str | None = Field(default=None, min_length=2, max_length=120)
    logo: str | None = None

