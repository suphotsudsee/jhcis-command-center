from datetime import datetime


class DashboardService:
    """Mock-first service. Replace mock data with MariaDB Data Mart queries for production."""

    def get_kpi(self):
        return {
            "lastUpdated": datetime.now().isoformat(),
            "items": [
                {"key": "opd", "label": "Total OPD", "value": 1556, "unit": "visits", "accent": "blue"},
                {"key": "ncd", "label": "NCD Clinic", "value": 690, "unit": "visits", "accent": "emerald"},
                {"key": "telemed", "label": "Telemedicine", "value": 120, "unit": "visits", "targetPercent": 68, "accent": "purple"},
                {"key": "pp", "label": "Health Promotion", "value": 310, "unit": "visits", "accent": "orange"},
                {"key": "ttm", "label": "Thai Traditional", "value": 86, "unit": "visits", "accent": "purple"},
                {"key": "refer", "label": "Refer Out", "value": 40, "unit": "cases", "accent": "red"},
            ],
        }

    def get_pcu_status(self):
        return [
            {"pcu": "รพ.สต.เหล่าเสือโก้ก", "district": "เหล่าเสือโก้ก", "opd": 138, "ncd": 62, "refer": 4, "status": "critical"},
            {"pcu": "รพ.สต.โพนเมือง", "district": "เหล่าเสือโก้ก", "opd": 92, "ncd": 44, "refer": 1, "status": "warning"},
            {"pcu": "รพ.สต.หนองบก", "district": "เหล่าเสือโก้ก", "opd": 77, "ncd": 29, "refer": 0, "status": "normal"},
            {"pcu": "รพ.สต.แพงใหญ่", "district": "เหล่าเสือโก้ก", "opd": 113, "ncd": 55, "refer": 2, "status": "warning"},
        ]

    def get_alerts(self):
        return [
            {"time": "09:20", "pcu": "รพ.สต.เหล่าเสือโก้ก", "type": "Severe BP", "severity": "red", "detail": "BP > 180/120"},
            {"time": "10:05", "pcu": "รพ.สต.โพนเมือง", "type": "High DTX", "severity": "orange", "detail": "DTX > 300"},
            {"time": "11:12", "pcu": "รพ.สต.แพงใหญ่", "type": "Refer Pending", "severity": "red", "detail": "รอส่งต่อ"},
        ]

    def get_trends(self):
        return [
            {"date": "D-6", "opd": 1200, "ncd": 510},
            {"date": "D-5", "opd": 1340, "ncd": 560},
            {"date": "D-4", "opd": 1420, "ncd": 600},
            {"date": "D-3", "opd": 1390, "ncd": 580},
            {"date": "D-2", "opd": 1488, "ncd": 640},
            {"date": "D-1", "opd": 1525, "ncd": 670},
            {"date": "Today", "opd": 1556, "ncd": 690},
        ]

    def get_map(self):
        return [
            {"id": 1, "name": "รพ.สต.เหล่าเสือโก้ก", "lat": 15.409, "lng": 104.923, "status": "critical", "opd": 138},
            {"id": 2, "name": "รพ.สต.โพนเมือง", "lat": 15.412, "lng": 104.945, "status": "warning", "opd": 92},
            {"id": 3, "name": "รพ.สต.หนองบก", "lat": 15.390, "lng": 104.918, "status": "normal", "opd": 77},
        ]
