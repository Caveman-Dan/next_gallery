CREATE TABLE __PREFIX__access_profiles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  public TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE __PREFIX__access_profile_albums (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  access_profile_id INT UNSIGNED NOT NULL,
  album_path VARCHAR(512) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_profile_album (access_profile_id, album_path),                             /* rows must be unique in these two fields */
  CONSTRAINT fk_profile_albums_profile
    FOREIGN KEY (access_profile_id) REFERENCES __PREFIX__access_profiles (id)              /* Only allow ids that exist in the access_profiles table */
    ON DELETE CASCADE                                                                      /* Delete orphaned entries (if access_profile deleted) */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE __PREFIX__users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL DEFAULT '',
  last_name VARCHAR(100) NOT NULL DEFAULT '',
  phone VARCHAR(40) NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  status ENUM('pending', 'active', 'disabled') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE __PREFIX__user_access_profiles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  access_profile_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_profile (user_id, access_profile_id),                                /* rows must be unique in these two fields */
  CONSTRAINT fk_user_profiles_user
    FOREIGN KEY (user_id) REFERENCES __PREFIX__users (id)                                 /* Only allow ids that exist in the users table */
    ON DELETE CASCADE,                                                                    /* Delete orphaned entries (if user deleted) */
  CONSTRAINT fk_user_profiles_profile
    FOREIGN KEY (access_profile_id) REFERENCES __PREFIX__access_profiles (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE __PREFIX__sessions (
  id CHAR(64) NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sessions_user (user_id),
  KEY idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id) REFERENCES __PREFIX__users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO __PREFIX__access_profiles (name, public)
VALUES ('Public', 1);                                                                     /* seed first access profile */