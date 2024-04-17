output "security_group_ids" {
  description = "The IDs of the security groups created for each port"
  value       = values(aws_security_group.ingress_sg)[*].id
}