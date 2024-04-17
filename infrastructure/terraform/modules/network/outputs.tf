output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public_subnet.*.id
}

output "public_subnet_cidr_blocks" {
  description = "The CIDR blocks of the public subnets"
  value       = aws_subnet.public_subnet.*.cidr_block
}

# output "private_subnet_ids" {
#   description = "The IDs of the private subnets"
#   value       = aws_subnet.private_subnet.*.id
# }

# output "private_subnet_cidr_blocks" {
#   description = "The CIDR blocks of the private subnets"
#   value       = aws_subnet.private_subnet.*.cidr_block
# }

output "internet_gateway_id" {
  description = "The ID of the internet gateway"
  value       = aws_internet_gateway.main_igw.id
}

output "public_route_table_id" {
  description = "The ID of the public route table"
  value       = aws_route_table.public.id
}

output "rds_subnet_group_name" {
  description = "The ID of the RDS subnet group"
  value       = aws_db_subnet_group.rds_subnet_group.name
}