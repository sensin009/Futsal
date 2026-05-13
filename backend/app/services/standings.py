from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.enums import MatchStatus
from app.models.match import Match
from app.models.team import Team


def recompute_team_standings(db: Session) -> None:
    """Reset and rebuild team points table from all finished matches with scores."""
    for team in db.query(Team).all():
        team.points = 0
        team.wins = 0
        team.draws = 0
        team.losses = 0
        team.goals_for = 0
        team.goals_against = 0

    finished = (
        db.query(Match)
        .filter(Match.status == MatchStatus.finished)
        .order_by(Match.match_date.asc())
        .all()
    )
    for m in finished:
        if m.team_a_score is None or m.team_b_score is None:
            continue
        team_a = db.get(Team, m.team_a_id)
        team_b = db.get(Team, m.team_b_id)
        if not team_a or not team_b:
            continue
        sa, sb = int(m.team_a_score), int(m.team_b_score)
        team_a.goals_for += sa
        team_a.goals_against += sb
        team_b.goals_for += sb
        team_b.goals_against += sa
        if sa > sb:
            team_a.wins += 1
            team_a.points += 3
            team_b.losses += 1
        elif sb > sa:
            team_b.wins += 1
            team_b.points += 3
            team_a.losses += 1
        else:
            team_a.draws += 1
            team_b.draws += 1
            team_a.points += 1
            team_b.points += 1
