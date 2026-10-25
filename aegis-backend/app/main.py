from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_PREFIX
from app.database import init_db, SessionLocal
from app.routers import (
    analyze_router,
    incidents_router,
    escalation_router,
    changes_router,
    linkage_router,
    exposure_router,
    reconstruction_router,
    evidence_router,
    complaint_router,
    privacy_router,
    help_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    yield

app = FastAPI(
    title="AEGIS — Digital Safety Intelligence",
    description="Backend API for personal digital safety desk: threat escalation, exposure graph, threat linkage, case reconstruction, change detection, and rapid response.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount modular routers
app.include_router(analyze_router, prefix=API_PREFIX)
app.include_router(incidents_router, prefix=API_PREFIX)
app.include_router(escalation_router, prefix=API_PREFIX)
app.include_router(changes_router, prefix=API_PREFIX)
app.include_router(linkage_router, prefix=API_PREFIX)
app.include_router(exposure_router, prefix=API_PREFIX)
app.include_router(reconstruction_router, prefix=API_PREFIX)
app.include_router(evidence_router, prefix=API_PREFIX)
app.include_router(complaint_router, prefix=API_PREFIX)
app.include_router(privacy_router, prefix=API_PREFIX)
app.include_router(help_router, prefix=API_PREFIX)


@app.get("/")
def root():
    return {
        "product": "AEGIS",
        "descriptor": "Digital Safety Intelligence",
        "positioning": "Understand what is happening. Decide what happens next.",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get(f"{API_PREFIX}/health")
def health_check():
    return {"status": "healthy", "service": "AEGIS Core Intelligence"}
