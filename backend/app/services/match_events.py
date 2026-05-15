from sqlalchemy.orm import Session
from app.models.match import Match
from app.models.match_event import MatchEvent
from app.models.match_player_score import MatchPlayerScore
from app.models.enums import MatchEventType, MatchStatus
from app.schemas.matches import MatchEventCreate
from app.services.player_stats import recompute_player_profile_totals

def add_match_event(db: Session, match_id: int, payload: MatchEventCreate) -> MatchEvent:
    match = db.query(Match).filter(Match.id == match_id).one_or_none()
    if not match:
        raise ValueError("Match not found")

    # Create the event
    event = MatchEvent(
        match_id=match_id,
        player_id=payload.player_id,
        team_id=payload.team_id,
        event_type=payload.event_type,
        minute=payload.minute,
        description=payload.description
    )
    db.add(event)
    
    # Update Match Score if it's a goal
    if payload.event_type == MatchEventType.goal:
        if payload.team_id == match.team_a_id:
            match.team_a_score = (match.team_a_score or 0) + 1
        elif payload.team_id == match.team_b_id:
            match.team_b_score = (match.team_b_score or 0) + 1
            
    # Update MatchPlayerScore if a player is involved
    if payload.player_id:
        player_score = db.query(MatchPlayerScore).filter(
            MatchPlayerScore.match_id == match_id,
            MatchPlayerScore.player_id == payload.player_id
        ).one_or_none()
        
        if not player_score:
            player_score = MatchPlayerScore(
                match_id=match_id,
                player_id=payload.player_id
            )
            db.add(player_score)
            
        if payload.event_type == MatchEventType.goal:
            player_score.goals += 1
        elif payload.event_type == MatchEventType.assist:
            player_score.assists += 1
        elif payload.event_type == MatchEventType.yellow_card:
            player_score.yellow_card += 1
        elif payload.event_type == MatchEventType.red_card:
            player_score.red_card += 1
            
        db.flush() # Ensure ID is assigned if new
        
        # Recompute totals for this player
        # Note: the original service only recomputes for FINISHED matches.
        # If the user wants to see it LIVE, we might need to adjust that logic.
        # But for now, we follow the existing pattern.
        recompute_player_profile_totals(db, payload.player_id)

    db.commit()
    db.refresh(event)
    return event
