from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import MatchStatus, MatchEventType


class MatchEventOut(BaseModel):
    id: int
    match_id: int
    player_id: int | None
    team_id: int
    event_type: MatchEventType
    minute: int
    description: str | None
    created_at: datetime
    
    player_name: str | None = None
    team_name: str | None = None

    class Config:
        from_attributes = True


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
    team_a_name: str | None = None
    team_b_name: str | None = None
    events: list[MatchEventOut] = []

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


class MatchEventCreate(BaseModel):
    player_id: int | None = None
    team_id: int
    event_type: MatchEventType
    minute: int = Field(ge=0, le=120)
    description: str | None = Field(default=None, max_length=255)

