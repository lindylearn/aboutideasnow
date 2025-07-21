# security.tf

resource "aws_security_group" "alb" {
  name        = "aboutideasnow-typesense-alb-sg"
  description = "Allow traffic to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "aboutideasnow-typesense-alb-sg"
    project = "aboutideasnow"
  }
}

resource "aws_security_group" "typesense" {
  name        = "aboutideasnow-typesense-sg"
  description = "Allow traffic to Typesense"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 8108
    to_port         = 8108
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For debugging, restrict in production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "aboutideasnow-typesense-sg"
    project = "aboutideasnow"
  }
}
