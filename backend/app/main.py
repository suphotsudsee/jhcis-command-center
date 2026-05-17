from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="JHCIS Provincial Command Center API",
    version="1.0.0",
    description="Backend API for JHCIS executive dashboard",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "jhcis-dashboard-api"}

app.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])
