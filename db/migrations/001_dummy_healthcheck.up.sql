-- Dummy migration to prove the runner. Remove after the first real schema lands.
CREATE TABLE IF NOT EXISTS __PREFIX__migration_healthcheck (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY
);
