# JHCIS Provincial Executive Dashboard

Ubon Ratchathani Primary Care Command Center

Full-stack production-ready starter project for JHCIS executive dashboard.

## Stack

- Frontend: Next.js App Router, React, Tailwind CSS
- Backend: FastAPI
- Database: MariaDB / MySQL
- Cache: Redis
- Deploy: Docker Compose / Coolify / Portainer

## Quick Start

```bash
cp .env.example .env
docker compose up -d --build
```

Open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

## Main Features

- Dark command center UI
- KPI cards
- PCU map placeholder
- PCU status table
- Critical alerts
- Trend chart placeholder
- Auto refresh every 5 minutes
- Backend API mock mode
- Ready for JHCIS MariaDB mapping

## API Endpoints

```txt
GET /health
GET /api/dashboard/kpi
GET /api/dashboard/pcu-status
GET /api/dashboard/alerts
GET /api/dashboard/trends
GET /api/dashboard/map
```

## Production Notes

For real JHCIS data, update backend queries in:

```txt
backend/app/services/dashboard_service.py
```

Use Data Mart tables for performance:

```txt
daily_summary
pcu_daily_summary
critical_alerts
refer_summary
```

## Suggested Domain

```txt
dashboard.yourdomain.go.th
```

In Coolify, set frontend domain to the public URL and point backend internally through Docker network.
