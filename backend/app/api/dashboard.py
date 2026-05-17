from fastapi import APIRouter
from app.services.dashboard_service import DashboardService

router = APIRouter()
service = DashboardService()

@router.get("/kpi")
def get_kpi(date: str | None = None):
    return service.get_kpi(date)

@router.get("/pcu-status")
def get_pcu_status(date: str | None = None):
    return service.get_pcu_status(date)

@router.get("/alerts")
def get_alerts(date: str | None = None):
    return service.get_alerts(date)

@router.get("/trends")
def get_trends(date: str | None = None):
    return service.get_trends(date)

@router.get("/map")
def get_map(date: str | None = None):
    return service.get_map(date)
