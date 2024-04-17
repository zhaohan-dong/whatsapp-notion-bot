variable "ssh_public_key" {
  description = "SSH public key to be used for access to the ECS EC2 instances"
  sensitive   = true
}

resource "aws_key_pair" "ecs_key_pair" {
  key_name   = "ecs_key_pair"
  public_key = var.ssh_public_key
}