resource "aws_db_instance" "postgres" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = "db.t3.micro"
  username               = random_id.db_username.b64_url
  password               = random_password.db_password.result
  db_name                = random_id.db_name.b64_url
  parameter_group_name   = aws_db_parameter_group.postgres.name
  skip_final_snapshot    = true
  db_subnet_group_name   = var.rds_subnet_group_name
  multi_az               = var.enable_multi_az
  vpc_security_group_ids = var.vpc_security_group_ids
  publicly_accessible    = false


  tags = {
    Name = random_id.db_name.b64_url
  }
}

resource "aws_db_parameter_group" "postgres" {
  name   = "postgres"
  family = "postgres15"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "random_id" "db_name" {
  keepers = {
    deployment_ver = var.database_deployment_ver
  }
  prefix = "db"
  byte_length = 6
}

resource "random_id" "db_username" {
  keepers = {
    deployment_ver = var.database_deployment_ver
  }
  prefix = "user_"
  byte_length = 8
}

resource "random_password" "db_password" {
  keepers = {
    deployment_ver = var.database_deployment_ver
  }
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}