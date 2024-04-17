variable "vpc_zone_identifier" {
  description = "IDs of the subnets to attach to the autoscaling group"
  type        = list(string)
}

variable "security_group_ids" {
  description = "IDs of the security groups to attach to the autoscaling group"
  type        = list(string)
}