# ecs.tf

resource "aws_ecs_cluster" "main" {
  name = "aboutideasnow-typesense-cluster"
  tags = {
    project = "aboutideasnow"
  }
}

resource "aws_ecs_task_definition" "typesense" {
  family                   = "aboutideasnow-typesense"
  network_mode             = "host"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "typesense"
      image     = "typesense/typesense:29.0"
      essential = true
      portMappings = [
        {
          containerPort = 8108
          hostPort      = 8108
        }
      ]
      command = [
        "--data-dir", "/data",
        "--api-key=${random_string.typesense_api_key.result}",
        "--enable-cors",
        "--enable-search-analytics=true",
        "--analytics-dir=/data/analytics",
        "--analytics-flush-interval=60"
      ]
      mountPoints = [
        {
          sourceVolume  = "typesense-data"
          containerPath = "/data"
        }
      ]
    }
  ])

  volume {
    name      = "typesense-data"
    host_path = "/var/lib/typesense"
  }
  tags = {
    project = "aboutideasnow"
  }
}

resource "aws_ecs_service" "typesense" {
  name            = "aboutideasnow-typesense-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.typesense.arn
  desired_count   = 1
  launch_type     = "EC2"

  load_balancer {
    target_group_arn = aws_lb_target_group.typesense.arn
    container_name   = "typesense"
    container_port   = 8108
  }

  depends_on = [aws_lb_listener.https, aws_lb_listener.http]

  tags = {
    project = "aboutideasnow"
  }
}
