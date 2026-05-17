CREATE TABLE IF NOT EXISTS daily_summary (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  summary_date DATE NOT NULL,
  pcu_code VARCHAR(20) NOT NULL,
  opd_count INT DEFAULT 0,
  ncd_count INT DEFAULT 0,
  telemed_count INT DEFAULT 0,
  pp_count INT DEFAULT 0,
  ttm_count INT DEFAULT 0,
  refer_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_daily_pcu (summary_date, pcu_code),
  INDEX idx_summary_date (summary_date),
  INDEX idx_pcu_code (pcu_code)
);

CREATE TABLE IF NOT EXISTS critical_alerts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  event_time DATETIME NOT NULL,
  pcu_code VARCHAR(20) NOT NULL,
  alert_type VARCHAR(100) NOT NULL,
  severity ENUM('green','orange','red') DEFAULT 'orange',
  detail VARCHAR(255),
  is_resolved TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_time (event_time),
  INDEX idx_severity (severity),
  INDEX idx_pcu_code (pcu_code)
);
