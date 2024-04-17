variable "username" {
  description = "The name of the IAM user"
  type        = string
}

variable "path" {
  description = "The path of the IAM user"
  type        = string
}

variable "iam_user_pgp" {
  # See https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user_login_profile
  description = "The PGP key to encrypt the IAM user's password"
  type        = string
  default     = null
}

variable "policy_arn" {
  description = "The ARN of the IAM policy to attach to the user"
  type        = string
}

variable "console_access" {
  description = "Whether to create a login profile for the IAM user"
  type        = bool
  default     = false
}

variable "tags" {
  description = "A map of tags to assign to the IAM user"
  type        = map(string)
  default     = {}
}