from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import MatchStatus


class MatchOut(BaseModel):
    id: int
    team_a_id: int
    team_b_id: int
    match_date: datetime
    venue: str
    team_a_score: int | None
    team_b_score: int | None
    status: MatchStatus
    man_of_the_match_user_id: int | None = None

    class Config:
        from_attributes = True


class MatchCreate(BaseModel):
    team_a_id: int
    team_b_id: int
    match_date: datetime
    venue: str = Field(min_length=2, max_length=255)
    status: MatchStatus = MatchStatus.upcoming
    man_of_the_match_user_id: int | None = None


class MatchUpdate(BaseModel):
    team_a_id: int | None = None
    team_b_id: int | None = None
    match_date: datetime | None = None
    venue: str | None = Field(default=None, min_length=2, max_length=255)
    status: MatchStatus | None = None
    team_a_score: int | None = Field(default=None, ge=0, le=99)
    team_b_score: int | None = Field(default=None, ge=0, le=99)
    man_of_the_match_user_id: int | None = None

