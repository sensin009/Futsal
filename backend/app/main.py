from __future__ import annotations
 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
from fastapi.staticfiles import StaticFiles
from app.api.router import api_router
from app.core.config import settings
 
app = FastAPI(title=settings.app_name)

app.add_middleware(
     CORSMiddleware,
     allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
)

app.include_router(api_router)
app.mount("/static", StaticFiles(directory="static"), name="static")
 
 
@app.get("/healthz")
def healthz():
    return {"ok": True}
 
