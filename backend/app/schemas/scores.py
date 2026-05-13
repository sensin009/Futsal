from __future__ import annotations

from pydantic import BaseModel, Field


class MatchPlayerScoreOut(BaseModel):
    id: int
    match_id: int
    player_id: int
    goals: int
    assists: int
    yellow_card: int
    red_card: int
    performance_rating: int | None

    class Config:
        from_attributes = True


class MatchPlayerScoreUpsert(BaseModel):
    player_id: int
    goals: int = Field(default=0, ge=0, le=20)
    assists: int = Field(default=0, ge=0, le=20)
    yellow_card: int = Field(default=0, ge=0, le=2)
    red_card: int = Field(default=0, ge=0, le=1)
    performance_rating: int | None = Field(default=None, ge=1, le=10)

