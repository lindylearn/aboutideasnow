# providers.tf

provider "aws" {
  region = var.aws_region
}

data "aws_ami" "ecs_optimized_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "random_string" "typesense_api_key" {
  length  = 32
  special = false
}
