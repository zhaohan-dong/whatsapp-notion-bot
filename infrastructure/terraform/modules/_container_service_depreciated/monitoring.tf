# TODO: Disabled this for now due to cost
#resource "aws_kms_key" "cloudwatch_key" {
#  description             = "KMS key for encrypting CloudWatch Logs"
#  deletion_window_in_days = 7
#}

resource "aws_cloudwatch_log_group" "container_logs" {
  name = "default-containers"
}