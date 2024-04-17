# Define the ECS cluster
# - iam.tf: IAM role for ECS tasks and lambda scaling
# - autoscaling.tf: Autoscaling group for ECS cluster
# - monitoring.tf: Cloudwatch event rules and targets for ECS cluster
resource "aws_ecs_cluster" "default" {
  name = "default-ecs-cluster"

  configuration {
    execute_command_configuration {
      # TODO: Disabled kms key due to cost
      #kms_key_id = aws_kms_key.cloudwatch_key.key_id
      logging = "OVERRIDE" # Can be one of NONE, DEFAULT or OVERRIDE, uses log_configuration below when OVERRIDE

      # Configure container logs
      log_configuration {
        cloud_watch_encryption_enabled = false # TODO: Disabled kms key due to cost
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.container_logs.name
        s3_bucket_name                 = null # Disable S3 logging
        s3_bucket_encryption_enabled   = false
        s3_key_prefix                  = null
      }
    }
  }

  # Disable container insights (it costs money)
  setting {
    name  = "containerInsights"
    value = "disabled"
  }

  tags = {
    Name = "default-ecs-cluster"
    Type = "service-integration"
  }
}
