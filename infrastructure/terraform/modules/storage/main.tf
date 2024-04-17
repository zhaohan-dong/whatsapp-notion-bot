resource "aws_s3_bucket" "bucket" {
  bucket = var.name
}


# Bucket ownership is enforced by default "BucketOwnerEnforced" and recommended by AWS
resource "aws_s3_bucket_ownership_controls" "bucket_ownership_controls" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# ACL cannot be set if bucket owner is enforced
resource "aws_s3_bucket_acl" "bucket_acl" {
  count      = var.bucket_ownership_controls == "BucketOwnerEnforced" ? 0 : 1
  bucket     = aws_s3_bucket.bucket.id
  acl        = var.is_private ? "private" : "public-read"
  depends_on = [aws_s3_bucket.bucket]
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.bucket.id
  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Disabled"
  }
  depends_on = [aws_s3_bucket.bucket]
}

resource "aws_s3_bucket_lifecycle_configuration" "bucket_lifecycle" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    id     = "remove-${var.version_expiration}-days-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = var.version_expiration
    }
  }
  depends_on = [aws_s3_bucket.bucket]
}
