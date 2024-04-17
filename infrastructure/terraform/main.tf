# Network and Firewall
module "network" {
  source              = "./modules/network"
  availability_zones  = var.availability_zones
  vpc_cidr            = "10.0.0.0/16"
  public_subnet_cidrs = var.public_subnet_cidrs
  # TODO: private subnet disabled
  private_subnet_cidrs = var.private_subnet_cidrs
}

module "web_firewall" {
  source                      = "./modules/firewall"
  name                        = "web-firewall"
  vpc_id                      = module.network.vpc_id
  ports                       = [80, 443]
  allowed_ingress_cidr_blocks = ["10.0.0.0/16"]
  allowed_egress_cidr_blocks  = ["0.0.0.0/0"]
}

module "database_firewall" {
  source                      = "./modules/firewall"
  name                        = "database-firewall"
  vpc_id                      = module.network.vpc_id
  ports                       = [5432]
  allowed_ingress_cidr_blocks = var.public_subnet_cidrs
  allowed_egress_cidr_blocks  = var.public_subnet_cidrs
}

module "ssh_firewall" {
  source                      = "./modules/firewall"
  name                        = "ssh-firewall"
  vpc_id                      = module.network.vpc_id
  ports                       = [22]
  allowed_ingress_cidr_blocks = ["0.0.0.0/0"]
  allowed_egress_cidr_blocks  = var.public_subnet_cidrs
}

module "efs_firewall" {
  source = "./modules/firewall"
  name   = "efs-firewall"
  vpc_id = module.network.vpc_id
  ports  = [2049]
  allowed_ingress_cidr_blocks = var.public_subnet_cidrs
  allowed_egress_cidr_blocks  = var.public_subnet_cidrs
}

# # Database
module "database" {
  source                 = "./modules/database"
  rds_subnet_group_name  = module.network.rds_subnet_group_name
  vpc_security_group_ids = module.database_firewall.security_group_ids
  enable_multi_az        = false
  availability_zones     = [var.availability_zones[0]] # Only use one AZ for this example
  database_deployment_ver = "1"
}

# Disabled due to switching to one EC2 instance solution instead of ECS for cost
# Also whatsapp bot can only run on one constant instance
# # Containers
# module "container_service" {
#   source              = "./modules/container_service"
#   vpc_zone_identifier = module.network.public_subnet_ids # Only use public subnets for this example
#   security_group_ids  = concat(module.web_firewall.security_group_ids, module.ssh_firewall.security_group_ids)
# }

# # Notion ECS Task
# module "notion_ecs_service" {
#   source = "./modules/container_tasks/notion_task"
#   #whatsapp_auth_volume_availability_zone = var.availability_zones[0]
#   jwt_secret_key                  = var.jwt_secret_key
#   notion_database_id              = var.notion_database_id
#   notion_api_key                  = var.notion_api_key
#   whatsapp_number                 = "120363148180188997@g.us"
#   whatsapp_efs_subnet_ids         = module.network.public_subnet_ids
#   whatsapp_efs_security_group_ids = module.web_firewall.security_group_ids
#   ecs_cluster_arn                 = module.container_service.ecs_cluster_arn
#   ecs_execution_role_arn          = module.container_service.ecs_execution_role_arn
#   whatsapp_efs_vpc_id             = module.network.vpc_id
# }


# EC2 Instance
variable "ssh_public_key" {
  description = "SSH public key to be used for access to the ECS EC2 instances"
  sensitive   = true
  default     = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCzfB0esB7SVQ4VLX/OXB0js4/UpCZnIRXa6/teynshRTXoVWwrKPvfbfL9DP0/9fbsDWrpklTlCUCwsv2YyutxKNNrH/mLnki9moCudz/+TdtsigJoz7UUXI1XMrTslmfZoiZuF2IBSXOejpmLw9FjF29ENaftspfE2nWDJPT8EadbpUXVL1Tr3+NaoFWP7nufhVfHk02F0VdQUKyERNYLsPjwnnCicMgawsvOD7pIUjPv/OSgWXRfZvrXQuRdTBlCfbfY/CELpTDwmyqq/gEh6Epw3kootWwqrv4MF5Ll/WOUm8sIunuzyfXrK0huzuTkl8/I1ryPU5gcTytax0NKjbAw8r9pwP3d5rMN0oDQbVLrsiOjMXjL9IdsngGd5kEUI6uOPOL6CINfrCXvxebUNwVOCFsSM2nGRYH5d2ekobjIZvyUqI3iG0+mjMurHA9SGNnP6uzJJISLSh161hO3Y54EPrrLbc7x6kj8T0/GWZ0MwliUbH0EYynMkm4nBNszEC4QfGqg9NQ26LD9JIbZlrETwrIt3VBxOaaFxmSP5Hz7YRgGtBnlOVo0AN/UtEceff+tFqQlGYOcWLorQykannJ2II3AhL9OYcMpOiaTo51ByPiidIfcq5zAZxCZhEhNc7tvRCMYJTcl2NMWBRanO5net0TcG/aWJkrI6b5QuQ=="
}

resource "aws_key_pair" "ec2_key_pair" {
  key_name   = "ec2_key_pair"
  public_key = var.ssh_public_key
}

### EC2 ECR Instance ###
module "ec2_container_instance" {
  source = "./modules/instance"
  name   = "ec2-container-instance"
  # Find latest ECS optimized AMI here: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html
  ami    = "ami-0e692fe1bae5ca24c"
  instance_type = "t2.micro"
  key_name = aws_key_pair.ec2_key_pair.key_name
  security_group_ids = concat(module.web_firewall.security_group_ids, module.ssh_firewall.security_group_ids)
  subnet_id = module.network.public_subnet_ids[0]
  iam_instance_profile = "ecr-readonly-profile"
}
resource "aws_iam_instance_profile" "ecr_readonly_profile" {
  name = "ecr-readonly-profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_iam_role" "ec2_role" {
  name = "ec2_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Effect = "Allow",
        Sid = ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.ec2_role.name
}

#### ECR Repositories ####

module "ecr_repository" {
  source = "./modules/image_repository"
  for_each = {
    notion-integration = {
      name = "notion-integration"
    },

    whatsapp-bot = {
      name = "whatsapp-bot"
    }
  }
  name = each.value.name
}