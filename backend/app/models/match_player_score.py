from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MatchPlayerScore(Base):
    __tablename__ = "match_player_scores"
    __table_args__ = (UniqueConstraint("match_id", "player_id", name="uq_match_player"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id", ondelete="CASCADE"), index=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    goals: Mapped[int] = mapped_column(Integer, default=0)
    assists: Mapped[int] = mapped_column(Integer, default=0)
    yellow_card: Mapped[int] = mapped_column(Integer, default=0)
    red_card: Mapped[int] = mapped_column(Integer, default=0)
    performance_rating: Mapped[int | None] = mapped_column(Integer, nullable=True)

    match = relationship("Match", back_populates="player_scores")
    player = relationship("User")

