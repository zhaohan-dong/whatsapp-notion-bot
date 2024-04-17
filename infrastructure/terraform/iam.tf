# IAM Users and IAM SSO Users
# Author: Zhaohan Dong


# Admin User List
locals {
  users = {
    "Admin User" = {
      email       = "msiisdgdev@gmail.com",
      given_name  = "MSIISDG",
      family_name = "Developer"
    }
  }
}

################# IAM ######################
# Create an IAM user with an access key and login profile
module "terraform_iam_user" {
  source         = "./modules/iam_user"
  username       = "terraform"
  path           = "/automation/"
  policy_arn     = "arn:aws:iam::aws:policy/AdministratorAccess"
  console_access = false
  tags = {
    Name = "terraform"
    Type = "ops"
  }
}

module "github_deploy_iam_user" {
  source         = "./modules/iam_user"
  username       = "github_deploy"
  path           = "/automation/"
  policy_arn     = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
  console_access = false
  tags = {
    Name = "github_deploy"
    Type = "ops"
  }
}

# Create an IAM group and add the user to the group
resource "aws_iam_group" "automation" {
  name = "automation"
  path = "/automation/"
}

resource "aws_iam_group_membership" "terraform_automation" {
  name = "terraform_automation_membership"

  users = [
    module.terraform_iam_user.username,
    module.github_deploy_iam_user.username
  ]
  group = aws_iam_group.automation.name

  depends_on = [
    module.terraform_iam_user,
    module.github_deploy_iam_user,
    aws_iam_group.automation
  ]
}

################# AWS SSO ######################
# See https://medium.com/cloud-native-daily/automate-aws-sso-using-terraform-2f219a45c16f

data "aws_ssoadmin_instances" "default" {}

# Create Group
resource "aws_identitystore_group" "admin" {
  identity_store_id = tolist(data.aws_ssoadmin_instances.default.identity_store_ids)[0]
  display_name      = "admin"
  description       = "Admin Group"
}

# Create Admin user
resource "aws_identitystore_user" "admin" {
  for_each = local.users

  identity_store_id = tolist(data.aws_ssoadmin_instances.default.identity_store_ids)[0]

  display_name = each.key
  user_name    = each.value.email

  name {
    given_name  = each.value.given_name
    family_name = each.value.family_name
  }

  emails {
    value = each.value.email
  }
}

# Create Group Membership for the user
resource "aws_identitystore_group_membership" "admin" {
  for_each = local.users

  identity_store_id = tolist(data.aws_ssoadmin_instances.default.identity_store_ids)[0]
  group_id          = aws_identitystore_group.admin.group_id
  member_id         = aws_identitystore_user.admin[each.key].user_id
}

# Create Managed Permission Set for Admin
resource "aws_ssoadmin_permission_set" "admin_permissionset" {
  name         = "AdministratorAccess"
  instance_arn = tolist(data.aws_ssoadmin_instances.default.arns)[0]
}

resource "aws_ssoadmin_managed_policy_attachment" "admin_managed_policy_attachment" {
  instance_arn       = tolist(data.aws_ssoadmin_instances.default.arns)[0]
  managed_policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
  permission_set_arn = aws_ssoadmin_permission_set.admin_permissionset.arn
}

# Assign admin permission set to the admin group
resource "aws_ssoadmin_account_assignment" "admin_group_assignment" {
  instance_arn       = tolist(data.aws_ssoadmin_instances.default.arns)[0]
  permission_set_arn = aws_ssoadmin_permission_set.admin_permissionset.arn

  principal_id   = aws_identitystore_group.admin.group_id
  principal_type = "GROUP"

  target_id   = var.aws_account_id # AWS Account ID
  target_type = "AWS_ACCOUNT"
}