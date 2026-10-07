CREATE TABLE device_push_tokens (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  expo_push_token VARCHAR(255) NOT NULL,
  platform VARCHAR(20) NOT NULL,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  UNIQUE KEY uq_device_push_token (expo_push_token),
  CONSTRAINT fk_device_push_user FOREIGN KEY (user_id) REFERENCES app_users(id)
);
