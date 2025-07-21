# vpc.tf

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name    = "aboutideasnow-typesense-vpc"
    project = "aboutideasnow"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name    = "aboutideasnow-typesense-public-subnet-${count.index}"
    project = "aboutideasnow"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name    = "aboutideasnow-typesense-igw"
    project = "aboutideasnow"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name    = "aboutideasnow-typesense-public-route-table"
    project = "aboutideasnow"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
