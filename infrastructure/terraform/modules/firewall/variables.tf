variable "name" {
  description = "The name of the security group"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC to attach the security group to"
  type        = string
}

variable "ports" {
  description = "List of ports for security groups"
  type        = list(number)
  default     = [80, 443]
}

variable "allowed_ingress_cidr_blocks" {
  description = "The CIDR blocks to allow ingress from, defaults to 10.0.0.0/16"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "allowed_egress_cidr_blocks" {
  description = "The CIDR blocks to allow egress to, defaults to all"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}