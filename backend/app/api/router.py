from __future__ import annotations

from fastapi import APIRouter

from app.api.routers import (
    auth,
    leaderboard_public,
    matches_admin,
    matches_public,
    me_match_scores,
    players_me,
    players_public,
    public_home,
    scores_admin,
    teams_admin,
    teams_public,
    users_admin,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)

api_router.include_router(players_public.router)
api_router.include_router(matches_public.router)
api_router.include_router(teams_public.router)
api_router.include_router(public_home.router)
api_router.include_router(leaderboard_public.router)
api_router.include_router(players_me.router)
api_router.include_router(me_match_scores.router)

api_router.include_router(users_admin.router)
api_router.include_router(teams_admin.router)
api_router.include_router(matches_admin.router)
api_router.include_router(scores_admin.router)

