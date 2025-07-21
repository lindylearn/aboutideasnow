# outputs.tf

output "typesense_host" {
  description = "The DNS name of the Typesense ALB."
  value       = aws_lb.main.dns_name
}

output "typesense_api_key" {
  description = "The Typesense API key."
  value       = random_string.typesense_api_key.result
  sensitive   = true
}
