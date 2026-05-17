# JHCIS SQL Mapping Guide

## OPD Today

```sql
SELECT COUNT(*) AS total_opd
FROM visit
WHERE DATE(visitdate) = CURDATE();
```

## NCD Today

```sql
SELECT COUNT(DISTINCT v.pid) AS total_ncd
FROM visit v
JOIN visitdiag d ON d.visitno = v.visitno
WHERE DATE(v.visitdate) = CURDATE()
AND (
  d.icd10 LIKE 'E10%' OR
  d.icd10 LIKE 'E11%' OR
  d.icd10 LIKE 'I10%'
);
```

## Refer Out Today

```sql
SELECT COUNT(*) AS total_refer
FROM referout
WHERE DATE(referdate) = CURDATE();
```

## Health Promotion

```sql
SELECT COUNT(*) AS total_pp
FROM visitepi
WHERE DATE(dateepi) = CURDATE();
```

## ANC

```sql
SELECT COUNT(*) AS total_anc
FROM visitanc
WHERE DATE(visitdate) = CURDATE();
```

## Suggested Indexes

```sql
CREATE INDEX idx_visit_visitdate ON visit(visitdate);
CREATE INDEX idx_visit_pid ON visit(pid);
CREATE INDEX idx_visitdiag_visitno ON visitdiag(visitno);
CREATE INDEX idx_visitdiag_icd10 ON visitdiag(icd10);
CREATE INDEX idx_referout_referdate ON referout(referdate);
```
