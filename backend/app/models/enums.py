from __future__ import annotations

import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    player = "player"


class UserStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class MatchStatus(str, enum.Enum):
    upcoming = "upcoming"
    live = "live"
    finished = "finished"


class PlayerPosition(str, enum.Enum):
    goalkeeper = "goalkeeper"
    defender = "defender"
    midfielder = "midfielder"
    attacker = "attacker"

