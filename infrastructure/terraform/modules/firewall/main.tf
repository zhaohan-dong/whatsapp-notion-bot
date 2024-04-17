resource "aws_security_group" "ingress_sg" {
  for_each = { for port in var.ports : port => port }

  name        = "${var.name}-ingress-sg-${each.key}"
  description = "Security group for ${var.name} port ${each.key}"
  vpc_id      = var.vpc_id

  # Inbound Rules
  ingress {
    from_port   = each.key
    to_port     = each.key
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidr_blocks
  }

  # Outbound Rule (Allowing all outbound traffic)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.allowed_egress_cidr_blocks
  }

  tags = {
    Name = "${var.name}-ingress-sg-${each.key}"
    Type = "network"
  }
}