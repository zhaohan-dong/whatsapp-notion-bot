output "db_name" {
  value = random_id.db_name.b64_url
}

output "db_username" {
  value = random_id.db_username.b64_url
}

output "db_password" {
  value = random_password.db_password.result
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}