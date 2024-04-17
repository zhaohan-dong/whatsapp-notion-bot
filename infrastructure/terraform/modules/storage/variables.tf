variable "name" {
  description = "The name of the bucket"
  type        = string
}

variable "bucket_ownership_controls" {
  description = "Bucket ownership BucketOwnerEnforced, BucketOwnerPreferred or ObjectWriter"
  type        = string
  default     = "BucketOwnerEnforced"
  validation {
    condition     = var.bucket_ownership_controls == "BucketOwnerEnforced" || var.bucket_ownership_controls == "BucketOwnerPreferred" || var.bucket_ownership_controls == "ObjectWriter"
    error_message = "Bucket ownership must be BucketOwnerEnforced, BucketOwnerPreferred or ObjectWriter"
  }
}

variable "is_private" {
  description = "Set the ACL to private or public-read"
  type        = bool
  default     = true
}

variable "enable_versioning" {
  description = "Enable versioning for the bucket"
  type        = bool
  default     = false
}

variable "version_expiration" {
  description = "Number of days to keep old versions of objects in the bucket (default: 7)"
  type        = number
  default     = 7
}