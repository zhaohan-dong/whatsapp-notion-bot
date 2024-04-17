# Purpose: Create an IAM user with an access key and login profile
resource "aws_iam_user" "default" {
  name = var.username
  path = var.path
  tags = var.tags
}

resource "aws_iam_access_key" "default" {
  user = var.username
}

resource "aws_iam_user_login_profile" "default" {
  count = var.console_access ? 1 : 0

  user = var.username
  # See https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_login_profile
  pgp_key = var.iam_user_pgp
  depends_on = [
    aws_iam_user.default,
    aws_iam_access_key.default
  ]

  lifecycle {
    ignore_changes = [
      password_length,
      password_reset_required,
      pgp_key,
    ]
    create_before_destroy = true
  }
}

resource "aws_iam_user_policy_attachment" "default" {
  user       = var.username
  policy_arn = var.policy_arn
}