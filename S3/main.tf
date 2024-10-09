provider "aws" {
  region = "us-west-2"
}

# Create an S3 bucket
resource "aws_s3_bucket" "main" {
  bucket = "my-unique-s3-bucket-name" # Ensure this name is globally unique
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = "MyS3Bucket"
    Environment = "Test"
  }
}

# Bucket policy to restrict public access
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.main.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource  = [
          "${aws_s3_bucket.main.arn}",
          "${aws_s3_bucket.main.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.main.arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "private"
          }
        }
      }
    ]
  })
}

# Enable logging for the bucket
resource "aws_s3_bucket_logging" "bucket_logging" {
  bucket = aws_s3_bucket.main.id

  target_bucket = aws_s3_bucket.main.id
  target_prefix = "log/"
}

# Enable lifecycle policy
resource "aws_s3_bucket_lifecycle_configuration" "lifecycle" {
  bucket = aws_s3_bucket.main.id

  rule {
    id     = "lifecycle_rule"
    status = "Enabled"

    expiration {
      days = 30
    }
  }
}

# Output the bucket ID
output "s3_bucket_id" {
  value = aws_s3_bucket.main.id
}

# Output the bucket ARN
output "s3_bucket_arn" {
  value = aws_s3_bucket.main.arn
}
