from fastapi import APIRouter
from app.services.dashboard_service import DashboardService

router = APIRouter()
service = DashboardService()

@router.get("/kpi")
def get_kpi():
    return service.get_kpi()

@router.get("/pcu-status")
def get_pcu_status():
    return service.get_pcu_status()

@router.get("/alerts")
def get_alerts():
    return service.get_alerts()

@router.get("/trends")
def get_trends():
    return service.get_trends()

@router.get("/map")
def get_map():
    return service.get_map()
