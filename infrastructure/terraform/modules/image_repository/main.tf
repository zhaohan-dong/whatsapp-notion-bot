resource "aws_ecr_repository" "default" {
  name = var.name # Name of the repository
  encryption_configuration {
    encryption_type = "AES256" # Or "KMS", need to specify kms_key_id if "KMS"
  }
  image_tag_mutability = "MUTABLE" # or "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }

  tags = {
    Name = var.name
    Type = "ops"
  }
}

resource "aws_ecr_lifecycle_policy" "example" {
  repository = aws_ecr_repository.default.name

  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire images older than 30 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 30
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}