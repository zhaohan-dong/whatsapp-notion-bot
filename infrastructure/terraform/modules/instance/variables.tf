variable "name" {
  description = "Name of the instance"
  type        = string
}

variable "instance_type" {
  description = "Type of instance, defaults to t2.micro"
  type        = string
  default     = "t2.micro"
}

variable "ami" {
  description = "AMI to use for the instance"
  type        = string
}

variable "key_name" {
  description = "Name of the key pair to use for the instance"
  type        = string
}

variable "security_group_ids" {
  description = "List of security group IDs to attach to the instance"
  type        = list(string)
}

variable "subnet_id" {
  description = "Subnet ID to use for the instance"
  type        = string
}

variable "iam_instance_profile" {
  description = "IAM instance profile to attach to the instance"
  type        = string
  default = ""
}