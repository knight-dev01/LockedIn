from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import create_tables
from app.routes import auth, profile, claims, trust, search, connections, notifications

settings = get_settings()

app = FastAPI(
    title="LockedIn API",
    description="Universal Professional Identity Verification System — Proof Over Claims.",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(claims.router, prefix="/api/v1")
app.include_router(trust.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(connections.router, prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")


@app.on_event("startup")
def on_startup():
    """Create database tables on startup."""
    create_tables()


@app.get("/")
def root():
    return {
        "name": "LockedIn API",
        "version": "1.0.0",
        "tagline": "Proof Over Claims.",
        "status": "operational",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
