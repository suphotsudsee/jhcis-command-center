# Product Requirements Document

Project Name: JHCIS Provincial Executive Dashboard  
Version: 1.0 Production Starter  
Target: Primary Care Command Center

## Objective

Revamp existing JHCIS web application into a modern provincial command center dashboard for OPD, NCD, Telemedicine, Health Promotion, Thai Traditional Medicine, Refer Out, PCU status, and critical alerts.

## Design System

- Background: `#0f172a` / `bg-slate-900`
- Card: `#1e293b` / `bg-slate-800`
- Text: white / slate-400
- OPD: blue
- NCD: emerald
- PP: orange
- Refer/Critical: red
- Thai Traditional: purple
- Font: Prompt / Noto Sans Thai

## Main Dashboard

1. KPI Cards
2. Real-time Monitoring Map
3. PCU Status Table
4. Critical Alerts
5. 7-day Trend Chart
6. Auto refresh design ready

## Data Mart Tables

- `daily_summary`
- `critical_alerts`

## Production Deployment

Use Docker Compose or Coolify.

Recommended public domain:

```txt
dashboard.yourdomain.go.th
```
