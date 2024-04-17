# Scale ECS cluster with ASG capacity provider

resource "aws_ecs_cluster_capacity_providers" "ecs_cluster_capacity_provider" {
  cluster_name       = aws_ecs_cluster.default.name
  capacity_providers = [aws_ecs_capacity_provider.ec2_capacity_provider.name]

  default_capacity_provider_strategy {
    base              = 0
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.ec2_capacity_provider.name
  }
}

resource "aws_ecs_capacity_provider" "ec2_capacity_provider" {
  name = "ec2-capacity-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.ecs_asg.arn
    managed_termination_protection = "DISABLED"

    managed_scaling {
      status                    = "ENABLED"
      target_capacity           = 100
      minimum_scaling_step_size = 1
      maximum_scaling_step_size = 100
    }
  }
}

resource "aws_launch_template" "ecs" {
  name        = "ecs-launch-template"
  description = "ECS Launch Template with image id: ami-0e692fe1bae5ca24c"

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 30 # Minimum 30GB for the ami
      volume_type = "gp2"
    }
  }

  ebs_optimized = false

  # Find latest ECS optimized AMI here: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html
  image_id               = "ami-0e692fe1bae5ca24c"
  instance_type          = "t2.micro"
  vpc_security_group_ids = var.security_group_ids
  key_name               = aws_key_pair.ecs_key_pair.key_name

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              echo "ECS_CLUSTER=${aws_ecs_cluster.default.name}" >> /etc/ecs/ecs.config
              sudo yum install -y ec2-instance-connect
              EOF
  )

  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_autoscaling_group" "ecs_asg" {
  name = "ecs-asg"
  launch_template {
    id      = aws_launch_template.ecs.id
    version = "$Latest"
  }
  min_size         = 0
  desired_capacity = 0
  max_size         = 1

  # Define vpc zone identifiers instead of using availability zones
  vpc_zone_identifier = var.vpc_zone_identifier

  # Health check type
  health_check_type         = "EC2"
  health_check_grace_period = 300

  force_delete         = true
  termination_policies = ["OldestInstance"]

  tag {
    key                 = "Name"
    value               = "ECS Instance"
    propagate_at_launch = true
  }

  tag {
    key                 = "AmazonECSManaged"
    value               = true
    propagate_at_launch = true
  }
}
