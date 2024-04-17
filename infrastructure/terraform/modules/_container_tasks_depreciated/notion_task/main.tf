# Notion ECS Tasks
# Note: ECS cluster is defined in main.tf. This file only contains task definitions and task related resources.

# Task
resource "aws_cloudwatch_event_rule" "every_monday" {
  name                = "run-task-every-monday"
  description         = "Run ECS task every Monday at 8 AM"
  schedule_expression = "cron(0 8 ? * MON *)"

  tags = {
    Name = "run-task-every-monday"
    Type = "service-integration"
  }
}

resource "aws_cloudwatch_event_target" "run_notion_msg_task" {
  rule     = aws_cloudwatch_event_rule.every_monday.name
  arn      = var.ecs_cluster_arn
  role_arn = var.ecs_execution_role_arn

  ecs_target {
    task_definition_arn = aws_ecs_task_definition.send_notion_msg_task.arn
    task_count          = 1
    launch_type         = "EC2"
  }
}

resource "aws_cloudwatch_log_group" "whatsapp_bot_logs" {
  name = "whatsapp-bot-logs"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "notion_integration_logs" {
  name = "notion-integration-logs"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "send_notion_msg_task" {
  family                   = "notion-ecs-task-family"
  network_mode             = "bridge" # awsvpc is required for Fargate
  requires_compatibilities = ["EC2"]
  cpu                      = "384"
  memory                   = "768"
  execution_role_arn       = var.ecs_execution_role_arn

  container_definitions = templatefile("${path.module}/container_definitions.tftpl", {
    whatsapp_bot_image_repository          = module.whatsapp_bot_image_repository.repository_url,
    notion_integration_image_repository    = module.notion_integration_image_repository.repository_url,
    jwt_secret_key                         = var.jwt_secret_key,
    notion_api_key                         = var.notion_api_key,
    notion_database_id                     = var.notion_database_id,
    whatsapp_number                        = var.whatsapp_number,
    whatsapp_log_group_name                = aws_cloudwatch_log_group.whatsapp_bot_logs.name
    notion_log_group_name                  = aws_cloudwatch_log_group.notion_integration_logs.name
  })

  volume {
    name = "whatsapp-bot-auth" # Also mentioned in container_definitions.json
    efs_volume_configuration {
      file_system_id          = aws_efs_file_system.whatsapp_bot_auth_efs.id
      root_directory          = "/"
      transit_encryption      = "ENABLED"
      # transit_encryption_port = 2049 # Not specified to avoid port conflict while re-running a task on the same ec2 instance, see https://stackoverflow.com/questions/75391988/mounting-aws-efs-to-ecs-ec2-container
    }
  }
}