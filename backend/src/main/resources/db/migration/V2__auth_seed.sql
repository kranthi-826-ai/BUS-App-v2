ALTER TABLE app_users ADD COLUMN university_id CHAR(36) NULL;
CREATE INDEX idx_users_email ON app_users(email);
