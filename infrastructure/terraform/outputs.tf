# Terraform Outputs
# Author: Zhaohan Dong


#### AWS IAM User Outputs ####
# Output password if console access is enabled
output "iam_user_password" {
  value = module.terraform_iam_user.password
}

output "iam_key_fingerprint" {
  value = module.terraform_iam_user.iam_key_fingerprint
}

# Output the identity store ID for login url
output "identity_store_id" {
  value = tolist(data.aws_ssoadmin_instances.default.identity_store_ids)[0]
}

#### Database Outputs ####
output "user_db_endpoint" {
  value = module.database.db_endpoint
  sensitive = true
}

output "user_db_name" {
  value = module.database.db_name
  sensitive = true
}

output "user_db_username" {
  value = module.database.db_username
  sensitive = true
}

output "user_db_password" {
  value = module.database.db_password
  sensitive = true
}

# output "ecs_cluster_arn" {
#   value = module.container_service.ecs_cluster_arn
# }

# output "ecs_repository_url" {
#   value = module.notion_ecs_service.ecs_repository_urls
# }