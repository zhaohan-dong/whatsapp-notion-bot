resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
    Type = "network"
  }
}

######## Public Subnet ########
resource "aws_subnet" "public_subnet" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  availability_zone       = var.availability_zones[count.index]
  cidr_block              = var.public_subnet_cidrs[count.index]
  map_public_ip_on_launch = true

  depends_on = [aws_vpc.main]

  tags = {
    Name = "public-subnet-${count.index}"
    Type = "network"
  }
}

resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
    Type = "network"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_igw.id
  }

  tags = {
    Name = "public-route-table"
    Type = "network"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public_subnet)
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public.id
}

######## Private Subnet ########
#Private Subnet Configuration
resource "aws_subnet" "private_subnet" {
  count      = length(var.availability_zones)
  vpc_id     = aws_vpc.main.id
  availability_zone = var.availability_zones[count.index]
  cidr_block = var.private_subnet_cidrs[count.index]
  map_public_ip_on_launch = false

  depends_on = [ aws_vpc.main ]

  tags = {
    Name = "private-subnet-${count.index}"
    Type = "network"
  }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = aws_subnet.private_subnet[*].id

  tags = {
    Name = "rds-subnet-group"
    Type = "network"
  }
}