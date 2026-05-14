from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.enums import UserRole, UserStatus


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    status: UserStatus
    is_blocked: bool
    team_id: int | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdateAdmin(BaseModel):
    name: str | None = None
    role: UserRole | None = None
    status: UserStatus | None = None
    is_blocked: bool | None = None
    team_id: int | None = None

