data "aws_caller_identity" "current" {}

output "password" {
  description = "The IAM user's password encrypted by the PGP key"
  value       = var.console_access ? aws_iam_user_login_profile.default[0].encrypted_password : null
}

output "iam_key_fingerprint" {
  description = "The fingerprint of the PGP key used to encrypt the IAM user's password"
  value       = var.console_access ? aws_iam_user_login_profile.default[0].key_fingerprint : null
}

output "username" {
  description = "The IAM username"
  value       = aws_iam_user.default.name
}