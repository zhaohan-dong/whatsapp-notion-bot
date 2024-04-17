resource "aws_efs_file_system" "whatsapp_bot_auth_efs" {

  # availability_zone_name = var.whatsapp_auth_volume_availability_zone # Replace with the AZ name where you want to create the EFS volume
  encrypted = true
  tags = {
    Name = "whatsapp-bot-auth-efs"
    Type = "service-integration"
  }
}

resource "aws_efs_mount_target" "whatsapp_bot_auth_efs_mt" {
  count           = length(var.whatsapp_efs_subnet_ids)
  file_system_id  = aws_efs_file_system.whatsapp_bot_auth_efs.id
  subnet_id       = var.whatsapp_efs_subnet_ids[count.index]  # Assuming you have a variable `subnets` containing subnet IDs
  security_groups = [aws_security_group.efs_sg.id]   # Specify the appropriate security group
}

resource "aws_security_group" "efs_sg" {
  name        = "EFS-access-for-sg"
  description = "Security Group for EFS"
  vpc_id      = var.whatsapp_efs_vpc_id # Replace with your VPC ID or a reference to it

  ingress {
    from_port   = 2049 # NFS port
    to_port     = 2049
    protocol    = "tcp"
    security_groups = var.whatsapp_efs_security_group_ids # Reference to the ECS instance or task SG
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "EFS-access-for-sg"
  }
}
