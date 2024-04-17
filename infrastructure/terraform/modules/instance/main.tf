data "aws_subnet" "selected" {
  id = var.subnet_id
}

resource "aws_instance" "default" {
  ami                    = var.ami # This is an example AMI ID. Replace it with the ID of your desired AMI.
  instance_type          = var.instance_type
  vpc_security_group_ids = var.security_group_ids
  subnet_id              = var.subnet_id
  key_name               = var.key_name
  iam_instance_profile   = var.iam_instance_profile

  tags = {
    Name = "${var.name}"
  }

  root_block_device {
    volume_type           = "gp2"
    volume_size           = 30
    encrypted             = true
    delete_on_termination = false
  }

  lifecycle {
    create_before_destroy = false
  }
}