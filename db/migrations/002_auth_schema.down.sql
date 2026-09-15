-- Drops auth tables and the seeded Public profile. Users and sessions are removed.
DROP TABLE IF EXISTS __PREFIX__sessions;
DROP TABLE IF EXISTS __PREFIX__user_access_profiles;
DROP TABLE IF EXISTS __PREFIX__access_profile_albums;
DROP TABLE IF EXISTS __PREFIX__users;
DROP TABLE IF EXISTS __PREFIX__access_profiles;