from __future__ import annotations

from pydantic import BaseModel, Field

from app.models.enums import PlayerPosition


class PlayerProfileOut(BaseModel):
    id: int
    user_id: int
    photo: str | None
    age: int | None
    phone: str | None
    position: PlayerPosition | None
    jersey_number: int | None

    total_goals: int
    total_assists: int
    total_matches: int
    yellow_cards: int
    red_cards: int

    class Config:
        from_attributes = True


class PlayerProfileUpsert(BaseModel):
    photo: str | None = None
    age: int | None = Field(default=None, ge=5, le=80)
    phone: str | None = None
    position: PlayerPosition | None = None
    jersey_number: int | None = Field(default=None, ge=0, le=99)


class PlayerDirectoryEntry(BaseModel):
    user_id: int
    name: str
    photo: str | None
    age: int | None
    position: PlayerPosition | None
    jersey_number: int | None
    total_goals: int
    total_assists: int
    total_matches: int
    yellow_cards: int
    red_cards: int

