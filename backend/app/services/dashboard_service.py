import os
from datetime import datetime

from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError


class DashboardService:
    """Dashboard service backed by JHCIS MySQL with mock fallback."""

    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL")
        self.engine = create_engine(
            self.database_url,
            pool_pre_ping=True,
            pool_recycle=1800,
        ) if self.database_url else None

    def _fetchone(self, sql, params=None):
        with self.engine.connect() as conn:
            row = conn.execute(text(sql), params or {}).mappings().first()
            return self._normalize_row(dict(row)) if row else {}

    def _fetchall(self, sql, params=None):
        with self.engine.connect() as conn:
            return [self._normalize_row(dict(row)) for row in conn.execute(text(sql), params or {}).mappings().all()]

    def _normalize_row(self, row):
        return {key: self._fix_text(value) for key, value in row.items()}

    def _fix_text(self, value):
        if not isinstance(value, str):
            return value

        # Some legacy JHCIS tables contain UTF-8 Thai bytes exposed through latin1 metadata.
        if "à¸" in value or "à¹" in value:
            try:
                return value.encode("latin1").decode("utf-8")
            except UnicodeError:
                return value

        return value

    def _latest_visit_date(self):
        row = self._fetchone("SELECT MAX(visitdate) AS latest_date FROM visit WHERE visitdate <= CURDATE()")
        return row.get("latest_date")

    def get_kpi(self):
        if not self.engine:
            return self._mock_kpi()

        try:
            latest_date = self._latest_visit_date()
            if not latest_date:
                return self._mock_kpi()

            totals = self._fetchone(
                """
                SELECT
                  (SELECT COUNT(*) FROM visit WHERE visitdate = :latest_date) AS opd,
                  (
                    SELECT COUNT(DISTINCT CONCAT(v.pcucode, ':', v.pid))
                    FROM visit v
                    JOIN visitdiag d ON d.pcucode = v.pcucode AND d.visitno = v.visitno
                    WHERE v.visitdate = :latest_date
                      AND (d.diagcode LIKE 'E10%' OR d.diagcode LIKE 'E11%' OR d.diagcode LIKE 'I10%')
                  ) AS ncd,
                  (
                    SELECT COUNT(*)
                    FROM visitrefer
                    WHERE DATE(datetimerefer) = :latest_date
                  ) AS refer,
                  (
                    SELECT COUNT(*)
                    FROM visitepi
                    WHERE dateepi = :latest_date
                  ) AS pp
                """,
                {"latest_date": latest_date},
            )

            return {
                "lastUpdated": datetime.now().isoformat(),
                "sourceDate": latest_date.isoformat(),
                "items": [
                    {"key": "opd", "label": "Total OPD", "value": totals.get("opd", 0), "unit": "visits", "accent": "blue"},
                    {"key": "ncd", "label": "NCD Clinic", "value": totals.get("ncd", 0), "unit": "patients", "accent": "emerald"},
                    {"key": "telemed", "label": "Telemedicine", "value": 0, "unit": "visits", "targetPercent": 0, "accent": "purple"},
                    {"key": "pp", "label": "Health Promotion", "value": totals.get("pp", 0), "unit": "services", "accent": "orange"},
                    {"key": "ttm", "label": "Thai Traditional", "value": 0, "unit": "visits", "accent": "purple"},
                    {"key": "refer", "label": "Refer Out", "value": totals.get("refer", 0), "unit": "cases", "accent": "red"},
                ],
            }
        except SQLAlchemyError:
            return self._mock_kpi()

    def get_pcu_status(self):
        if not self.engine:
            return self._mock_pcu_status()

        try:
            latest_date = self._latest_visit_date()
            if not latest_date:
                return self._mock_pcu_status()

            rows = self._fetchall(
                """
                SELECT
                  v.pcucode,
                  COALESCE(ch.hosname, CONCAT('PCU ', v.pcucode)) AS pcu,
                  COALESCE(ch.hosname, v.pcucode) AS district,
                  COUNT(DISTINCT CONCAT(v.pcucode, ':', v.visitno)) AS opd,
                  COUNT(DISTINCT CASE
                    WHEN d.diagcode LIKE 'E10%' OR d.diagcode LIKE 'E11%' OR d.diagcode LIKE 'I10%'
                    THEN CONCAT(v.pcucode, ':', v.pid)
                  END) AS ncd,
                  COUNT(DISTINCT vr.referid) AS refer
                FROM visit v
                LEFT JOIN visitdiag d ON d.pcucode = v.pcucode AND d.visitno = v.visitno
                LEFT JOIN visitrefer vr ON vr.pcucode = v.pcucode AND vr.visitno = v.visitno
                LEFT JOIN chospital ch ON ch.hoscode = v.pcucode
                WHERE v.visitdate BETWEEN DATE_SUB(:latest_date, INTERVAL 30 DAY) AND :latest_date
                GROUP BY v.pcucode, ch.hosname
                ORDER BY opd DESC
                LIMIT 12
                """,
                {"latest_date": latest_date},
            )

            for row in rows:
                row["status"] = "critical" if row["refer"] >= 3 else "warning" if row["refer"] >= 1 else "normal"

            return rows
        except SQLAlchemyError:
            return self._mock_pcu_status()

    def get_alerts(self):
        if not self.engine:
            return self._mock_alerts()

        try:
            latest_date = self._latest_visit_date()
            if not latest_date:
                return self._mock_alerts()

            refer_rows = self._fetchall(
                """
                SELECT
                  DATE_FORMAT(vr.datetimerefer, '%H:%i') AS time,
                  COALESCE(ch.hosname, CONCAT('PCU ', vr.pcucode)) AS pcu,
                  'Refer Pending' AS type,
                  'red' AS severity,
                  COALESCE(vr.reason, vr.request, 'รอส่งต่อ') AS detail
                FROM visitrefer vr
                LEFT JOIN chospital ch ON ch.hoscode = vr.pcucode
                WHERE DATE(vr.datetimerefer) BETWEEN DATE_SUB(:latest_date, INTERVAL 30 DAY) AND :latest_date
                ORDER BY vr.datetimerefer DESC
                LIMIT 6
                """,
                {"latest_date": latest_date},
            )
            return refer_rows
        except SQLAlchemyError:
            return self._mock_alerts()

    def get_trends(self):
        if not self.engine:
            return self._mock_trends()

        try:
            latest_date = self._latest_visit_date()
            if not latest_date:
                return self._mock_trends()

            return self._fetchall(
                """
                SELECT
                  DATE_FORMAT(v.visitdate, '%d/%m') AS date,
                  COUNT(DISTINCT CONCAT(v.pcucode, ':', v.visitno)) AS opd,
                  COUNT(DISTINCT CASE
                    WHEN d.diagcode LIKE 'E10%' OR d.diagcode LIKE 'E11%' OR d.diagcode LIKE 'I10%'
                    THEN CONCAT(v.pcucode, ':', v.pid)
                  END) AS ncd
                FROM visit v
                LEFT JOIN visitdiag d ON d.pcucode = v.pcucode AND d.visitno = v.visitno
                WHERE v.visitdate BETWEEN DATE_SUB(:latest_date, INTERVAL 13 DAY) AND :latest_date
                GROUP BY v.visitdate
                ORDER BY v.visitdate
                """,
                {"latest_date": latest_date},
            )
        except SQLAlchemyError:
            return self._mock_trends()

    def get_map(self):
        if not self.engine:
            return self._mock_map()

        try:
            households = self._fetchall(
                """
                SELECT
                  CONCAT(h.pcucode, '-', h.hcode) AS id,
                  h.hcode,
                  h.villcode,
                  COALESCE(vil.villname, h.villcode) AS village,
                  COALESCE(NULLIF(h.hno, ''), '-') AS house_no,
                  CAST(h.xgis AS DECIMAL(12,8)) AS lat,
                  CAST(h.ygis AS DECIMAL(12,8)) AS lng,
                  COUNT(DISTINCT p.pid) AS people,
                  SUM(CASE WHEN TIMESTAMPDIFF(YEAR, p.birth, CURDATE()) >= 60 THEN 1 ELSE 0 END) AS elderly,
                  COUNT(DISTINCT CASE
                    WHEN pc.chroniccode LIKE 'E10%' OR pc.chroniccode LIKE 'E11%' OR pc.chroniccode LIKE 'I10%'
                    THEN CONCAT(pc.pcucodeperson, ':', pc.pid)
                  END) AS ncd,
                  COUNT(DISTINCT CASE
                    WHEN pc.chroniccode LIKE 'E10%' OR pc.chroniccode LIKE 'E11%'
                    THEN CONCAT(pc.pcucodeperson, ':', pc.pid)
                  END) AS diabetes,
                  COUNT(DISTINCT CASE
                    WHEN pc.chroniccode LIKE 'I10%'
                    THEN CONCAT(pc.pcucodeperson, ':', pc.pid)
                  END) AS hypertension,
                  COUNT(DISTINCT CASE
                    WHEN pc.chroniccode IS NOT NULL
                      AND pc.chroniccode NOT LIKE 'E10%'
                      AND pc.chroniccode NOT LIKE 'E11%'
                      AND pc.chroniccode NOT LIKE 'I10%'
                    THEN CONCAT(pc.pcucodeperson, ':', pc.pid)
                  END) AS other_chronic,
                  0 AS pregnant
                FROM house h
                LEFT JOIN village vil ON vil.pcucode = h.pcucode AND vil.villcode = h.villcode
                LEFT JOIN person p ON p.pcucodeperson = h.pcucode AND p.hcode = h.hcode
                LEFT JOIN personchronic pc ON pc.pcucodeperson = p.pcucodeperson AND pc.pid = p.pid AND pc.datedischart IS NULL
                WHERE
                  h.xgis IS NOT NULL AND h.ygis IS NOT NULL
                  AND h.xgis <> '' AND h.ygis <> ''
                GROUP BY h.pcucode, h.hcode, h.villcode, vil.villname, h.hno, h.xgis, h.ygis
                ORDER BY ncd DESC, elderly DESC, people DESC
                LIMIT 1200
                """
            )

            members = self._fetchall(
                """
                SELECT
                  CONCAT(h.pcucode, '-', h.hcode) AS house_id,
                  p.pid,
                  TRIM(CONCAT(COALESCE(p.fname, ''), ' ', COALESCE(p.lname, ''))) AS name,
                  CASE p.sex WHEN '1' THEN 'ชาย' WHEN '2' THEN 'หญิง' ELSE p.sex END AS sex,
                  TIMESTAMPDIFF(YEAR, p.birth, CURDATE()) AS age,
                  CASE WHEN TIMESTAMPDIFF(YEAR, p.birth, CURDATE()) >= 60 THEN 1 ELSE 0 END AS elderly,
                  COALESCE(cf.ncd, 0) AS ncd,
                  COALESCE(cf.diabetes, 0) AS diabetes,
                  COALESCE(cf.hypertension, 0) AS hypertension,
                  COALESCE(cf.other_chronic, 0) AS other_chronic,
                  COALESCE(preg.pregnant, 0) AS pregnant,
                  preg.edc
                FROM house h
                JOIN person p ON p.pcucodeperson = h.pcucode AND p.hcode = h.hcode
                LEFT JOIN (
                  SELECT
                    pcucodeperson,
                    pid,
                    MAX(CASE WHEN chroniccode LIKE 'E10%' OR chroniccode LIKE 'E11%' OR chroniccode LIKE 'I10%' THEN 1 ELSE 0 END) AS ncd,
                    MAX(CASE WHEN chroniccode LIKE 'E10%' OR chroniccode LIKE 'E11%' THEN 1 ELSE 0 END) AS diabetes,
                    MAX(CASE WHEN chroniccode LIKE 'I10%' THEN 1 ELSE 0 END) AS hypertension,
                    MAX(CASE
                      WHEN chroniccode IS NOT NULL
                        AND chroniccode NOT LIKE 'E10%'
                        AND chroniccode NOT LIKE 'E11%'
                        AND chroniccode NOT LIKE 'I10%'
                      THEN 1 ELSE 0
                    END) AS other_chronic
                  FROM personchronic
                  WHERE datedischart IS NULL
                  GROUP BY pcucodeperson, pid
                ) cf ON cf.pcucodeperson = p.pcucodeperson AND cf.pid = p.pid
                LEFT JOIN (
                  SELECT
                    preg.pcucodeperson,
                    preg.pid,
                    1 AS pregnant,
                    MIN(preg.edc) AS edc
                  FROM visitancpregnancy preg
                  LEFT JOIN visitancdeliver del
                    ON del.pcucodeperson = preg.pcucodeperson
                    AND del.pid = preg.pid
                    AND del.pregno = preg.pregno
                  WHERE del.pid IS NULL
                    AND COALESCE(preg.edc, preg.firstdatecheck, preg.lmp) >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
                  GROUP BY preg.pcucodeperson, preg.pid
                ) preg ON preg.pcucodeperson = p.pcucodeperson AND preg.pid = p.pid
                WHERE h.xgis IS NOT NULL AND h.ygis IS NOT NULL
                  AND h.xgis <> '' AND h.ygis <> ''
                ORDER BY house_id, age DESC
                """
            )

            members_by_house = {}
            for member in members:
                house_id = member.pop("house_id")
                member.pop("pid", None)
                members_by_house.setdefault(house_id, []).append(member)

            for row in households:
                row_members = members_by_house.get(row["id"], [])
                row["members"] = row_members
                row["pregnant"] = sum(int(member.get("pregnant") or 0) for member in row_members)

            temples = self._fetchall(
                """
                SELECT
                  CONCAT(t.pcucode, '-', t.villcode, '-', t.templeno) AS id,
                  COALESCE(t.templename, 'วัด') AS name,
                  COALESCE(vil.villname, t.villcode) AS village,
                  COALESCE(
                    NULLIF(CAST(t.xgis AS DECIMAL(12,8)), 0),
                    AVG(CAST(h.xgis AS DECIMAL(12,8)))
                  ) AS lat,
                  COALESCE(
                    NULLIF(CAST(t.ygis AS DECIMAL(12,8)), 0),
                    AVG(CAST(h.ygis AS DECIMAL(12,8)))
                  ) AS lng
                FROM villagetemple t
                LEFT JOIN village vil ON vil.pcucode = t.pcucode AND vil.villcode = t.villcode
                LEFT JOIN house h ON h.pcucode = t.pcucode AND h.villcode = t.villcode
                  AND h.xgis IS NOT NULL AND h.ygis IS NOT NULL AND h.xgis <> '' AND h.ygis <> ''
                GROUP BY t.pcucode, t.villcode, t.templeno, t.templename, vil.villname, t.xgis, t.ygis
                HAVING lat IS NOT NULL AND lng IS NOT NULL
                LIMIT 100
                """
            )

            schools = self._fetchall(
                """
                SELECT
                  CONCAT(s.pcucode, '-', s.villcode, '-', s.schoolno) AS id,
                  COALESCE(s.schoolname, 'โรงเรียน') AS name,
                  COALESCE(vil.villname, s.villcode) AS village,
                  COALESCE(
                    NULLIF(CAST(s.xgis AS DECIMAL(12,8)), 0),
                    AVG(CAST(h.xgis AS DECIMAL(12,8)))
                  ) AS lat,
                  COALESCE(
                    NULLIF(CAST(s.ygis AS DECIMAL(12,8)), 0),
                    AVG(CAST(h.ygis AS DECIMAL(12,8)))
                  ) AS lng,
                  COALESCE(s.studenthead, 0) AS students
                FROM villageschool s
                LEFT JOIN village vil ON vil.pcucode = s.pcucode AND vil.villcode = s.villcode
                LEFT JOIN house h ON h.pcucode = s.pcucode AND h.villcode = s.villcode
                  AND h.xgis IS NOT NULL AND h.ygis IS NOT NULL AND h.xgis <> '' AND h.ygis <> ''
                GROUP BY s.pcucode, s.villcode, s.schoolno, s.schoolname, vil.villname, s.xgis, s.ygis, s.studenthead
                HAVING lat IS NOT NULL AND lng IS NOT NULL
                LIMIT 100
                """
            )

            all_points = households + temples + schools
            center = self._map_center(all_points)

            summary = {
                "households": len(households),
                "temples": len(temples),
                "schools": len(schools),
                "elderly": sum(int(row.get("elderly") or 0) for row in households),
                "ncd": sum(int(row.get("ncd") or 0) for row in households),
                "diabetes": sum(int(row.get("diabetes") or 0) for row in households),
                "hypertension": sum(int(row.get("hypertension") or 0) for row in households),
                "other": sum(int(row.get("other_chronic") or 0) for row in households),
                "pregnant": sum(int(row.get("pregnant") or 0) for row in households),
            }

            return {
                "center": center,
                "summary": summary,
                "layers": {
                    "houses": households,
                    "temples": temples,
                    "schools": schools,
                    "elderly": [row for row in households if int(row.get("elderly") or 0) > 0],
                    "ncd": [row for row in households if int(row.get("ncd") or 0) > 0],
                    "diabetes": [row for row in households if int(row.get("diabetes") or 0) > 0],
                    "hypertension": [row for row in households if int(row.get("hypertension") or 0) > 0],
                    "other": [row for row in households if int(row.get("other_chronic") or 0) > 0],
                    "pregnant": [row for row in households if int(row.get("pregnant") or 0) > 0],
                },
            }
        except SQLAlchemyError:
            return self._mock_map()

    def _map_center(self, points):
        valid_points = [
            point for point in points
            if point.get("lat") is not None and point.get("lng") is not None
        ]
        if not valid_points:
            return {"lat": 15.0, "lng": 105.0, "zoom": 11}

        return {
            "lat": sum(float(point["lat"]) for point in valid_points) / len(valid_points),
            "lng": sum(float(point["lng"]) for point in valid_points) / len(valid_points),
            "zoom": 11,
        }

    def _mock_kpi(self):
        return {
            "lastUpdated": datetime.now().isoformat(),
            "items": [
                {"key": "opd", "label": "Total OPD", "value": 0, "unit": "visits", "accent": "blue"},
                {"key": "ncd", "label": "NCD Clinic", "value": 0, "unit": "patients", "accent": "emerald"},
                {"key": "telemed", "label": "Telemedicine", "value": 0, "unit": "visits", "targetPercent": 0, "accent": "purple"},
                {"key": "pp", "label": "Health Promotion", "value": 0, "unit": "services", "accent": "orange"},
                {"key": "ttm", "label": "Thai Traditional", "value": 0, "unit": "visits", "accent": "purple"},
                {"key": "refer", "label": "Refer Out", "value": 0, "unit": "cases", "accent": "red"},
            ],
        }

    def _mock_pcu_status(self):
        return []

    def _mock_alerts(self):
        return []

    def _mock_trends(self):
        return []

    def _mock_map(self):
        return {
            "center": {"lat": 15.0, "lng": 105.0, "zoom": 11},
            "summary": {
                "households": 0,
                "temples": 0,
                "schools": 0,
                "elderly": 0,
                "ncd": 0,
                "diabetes": 0,
                "hypertension": 0,
                "other": 0,
                "pregnant": 0,
            },
            "layers": {
                "houses": [],
                "temples": [],
                "schools": [],
                "elderly": [],
                "ncd": [],
                "diabetes": [],
                "hypertension": [],
                "other": [],
                "pregnant": [],
            },
        }
