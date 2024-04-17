# Backend configuration

# Example by using Terraform Cloud: https://github.com/hashicorp/terraform-dynamic-credentials-setup-examples/tree/main/aws
# Terraform Cloud authenticates with AWS using a set of dynamic credentials.

terraform {
  backend "s3" {
    bucket = "msiisdg-tfstate"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

# Terraform state bucket
module "tfstate_bucket" {
  source                    = "./modules/storage"
  name                      = "msiisdg-tfstate"
  bucket_ownership_controls = "BucketOwnerEnforced"
  is_private                = true
  enable_versioning         = true
  version_expiration        = 7
}