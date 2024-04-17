variable "database_deployment_ver" {
  description = "The seed to keep database credentials consistent for one deployment"
  type        = string
  default     = "15"
}

variable "rds_subnet_group_name" {
  description = "The name of the RDS subnet group"
  type        = string
}

variable "vpc_security_group_ids" {
  description = "The security group IDs to use for the RDS database"
  type        = list(string)
}

variable "enable_multi_az" {
  description = "Enable multi-AZ for the RDS database, defaults to false"
  type        = bool
  default     = false
}

variable "availability_zones" {
  description = "The availability zones to use for the RDS database"
  type        = list(string)
}