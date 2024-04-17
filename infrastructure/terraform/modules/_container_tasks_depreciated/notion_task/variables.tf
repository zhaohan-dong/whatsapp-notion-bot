variable "ecs_cluster_arn" {
    description = "ARN of the ECS cluster"
    type      = string
}

variable "ecs_execution_role_arn" {
    description = "ARN of the ECS execution role"
    type      = string
}

variable "notion_api_key" {
    description = "API key to Notion App"
    type      = string
    sensitive = true
}

variable "notion_database_id" {
    description = "ID of the Notion database"
    type      = string
    sensitive = true
}

variable "jwt_secret_key" {
    description = "Secret key for JWT token of WhatsApp bot"
    type      = string
    sensitive = true
    validation {
        condition = var.jwt_secret_key != ""
        error_message = "JWT secret key cannot be empty"
    }
}

# variable "whatsapp_auth_volume_availability_zone" {
#     type    = string
# }

variable "whatsapp_number" {
    type    = string
}

variable "whatsapp_efs_subnet_ids" {
    type    = list(string)
}

variable "whatsapp_efs_security_group_ids" {
    type    = list(string)
}

variable "whatsapp_efs_vpc_id" {
    type    = string
}