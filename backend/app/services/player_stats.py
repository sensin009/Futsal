from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.enums import MatchStatus
from app.models.match import Match
from app.models.match_player_score import MatchPlayerScore
from app.models.player_profile import PlayerProfile
from app.models.user import User


def recompute_player_profile_totals(db: Session, user_id: int) -> None:
    """
    Recompute totals for a player from match_player_scores on finished matches only.
    """
    totals_stmt = (
        select(
            func.coalesce(func.sum(MatchPlayerScore.goals), 0),
            func.coalesce(func.sum(MatchPlayerScore.assists), 0),
            func.coalesce(func.sum(MatchPlayerScore.yellow_card), 0),
            func.coalesce(func.sum(MatchPlayerScore.red_card), 0),
            func.count(MatchPlayerScore.id),
        )
        .select_from(MatchPlayerScore)
        .join(Match, Match.id == MatchPlayerScore.match_id)
        .where(MatchPlayerScore.player_id == user_id, Match.status == MatchStatus.finished)
    )
    goals, assists, yellow, red, matches_count = db.execute(totals_stmt).one()

    profile = db.query(PlayerProfile).filter(PlayerProfile.user_id == user_id).one_or_none()
    if profile is None:
        profile = PlayerProfile(user_id=user_id)
        db.add(profile)

    profile.total_goals = int(goals)
    profile.total_assists = int(assists)
    profile.yellow_cards = int(yellow)
    profile.red_cards = int(red)
    profile.total_matches = int(matches_count)


def recompute_all_players(db: Session) -> None:
    ids = [row[0] for row in db.execute(select(User.id)).all()]
    for user_id in ids:
        recompute_player_profile_totals(db, user_id)

