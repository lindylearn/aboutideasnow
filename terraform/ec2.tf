# ec2.tf

resource "aws_launch_template" "ecs" {
  name_prefix   = "aboutideasnow-typesense-ecs-"
  image_id      = data.aws_ami.ecs_optimized_ami.id
  instance_type = var.instance_type
  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }
  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.typesense.id]
  }
  user_data = base64encode(<<-EOF
              #!/bin/bash
              echo ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config
              EOF
  )

  lifecycle {
    create_before_destroy = true
  }
  tags = {
    project = "aboutideasnow"
  }
}

resource "aws_autoscaling_group" "ecs" {
  name = "aboutideasnow-typesense-asg"
  launch_template {
    id      = aws_launch_template.ecs.id
    version = "$Latest"
  }
  vpc_zone_identifier = [for s in aws_subnet.public : s.id]
  min_size            = 1
  max_size            = 1
  desired_capacity    = 1

  tag {
    key                 = "Name"
    value               = "aboutideasnow-typesense-instance"
    propagate_at_launch = true
  }
  tag {
    key                 = "project"
    value               = "aboutideasnow"
    propagate_at_launch = true
  }
}
