# variables.tf

variable "aws_region" {
  description = "The AWS region to deploy to."
  type        = string
  default     = "eu-central-1"
}

variable "instance_type" {
  description = "The EC2 instance type for the Typesense node."
  type        = string
  default     = "t3.small"
}

variable "domain_name" {
  description = "The domain name for the service."
  type        = string
  default     = "search.aboutideasnow.com"
}
