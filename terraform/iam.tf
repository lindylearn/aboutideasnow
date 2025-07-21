# iam.tf

resource "aws_iam_role" "ecs_instance_role" {
  name = "aboutideasnow-typesense-ecs_instance_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
  tags = {
    project = "aboutideasnow"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_instance_role_attachment" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "aboutideasnow-typesense-ecs_instance_profile"
  role = aws_iam_role.ecs_instance_role.name
  tags = {
    project = "aboutideasnow"
  }
}
