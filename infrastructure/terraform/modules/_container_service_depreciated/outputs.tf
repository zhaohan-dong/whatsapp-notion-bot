output "ecs_cluster_arn" {
  value = aws_ecs_cluster.default.arn
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.default.name
}

output "ecs_execution_role_arn" {
  value = aws_iam_role.ecs_execution_role.arn
}

output "ecs_auto_scaling_group_name" {
  value = aws_autoscaling_group.ecs_asg.name
}
