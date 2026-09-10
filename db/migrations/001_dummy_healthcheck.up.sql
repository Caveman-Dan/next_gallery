-- Dummy migration to prove the runner. Remove after the first real schema lands.
CREATE TABLE IF NOT EXISTS _migration_healthcheck (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY
);
