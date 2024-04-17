

variable "region" {
  description = "The region to create the project"
  type        = string
}

variable "aws_account_id" {
  description = "The AWS account ID"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets"
  type        = list(string)
}

variable "availability_zones" {
  description = "List of Availability Zones"
  type        = list(string)
}



variable "jwt_secret_key" {
  description = "The secret key for JWT"
  type        = string
  sensitive   = true
}

variable "notion_database_id" {
  description = "The ID of the Notion database"
  type        = string
  sensitive   = true
}

variable "notion_api_key" {
  description = "The API key for Notion"
  type        = string
  sensitive   = true
}