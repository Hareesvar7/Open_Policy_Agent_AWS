provider "aws" {
  region = "us-west-2"
}

# Create an IAM user
resource "aws_iam_user" "example_user" {
  name = "example-user"

  tags = {
    Name = "Example User"
    Environment = "Test"
  }
}

# Create a policy for the IAM user
resource "aws_iam_policy" "example_policy" {
  name        = "example_policy"
  description = "An example policy for testing OPA policies"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "s3:ListBucket"
      Resource = "*"
    }]
  })
}

# Attach the policy to the IAM user
resource "aws_iam_user_policy_attachment" "attach_policy" {
  user       = aws_iam_user.example_user.name
  policy_arn = aws_iam_policy.example_policy.arn
}

# Create an IAM role
resource "aws_iam_role" "example_role" {
  name = "example-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Principal = { Service = "ec2.amazonaws.com" }
      Effect = "Allow"
    }]
  })
}

# Attach a managed policy to the IAM role
resource "aws_iam_role_policy_attachment" "attach_managed_policy" {
  role       = aws_iam_role.example_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
}

# Create a group
resource "aws_iam_group" "example_group" {
  name = "example-group"

  tags = {
    Name = "Example Group"
  }
}

# Add the user to the group
resource "aws_iam_group_membership" "group_membership" {
  group = aws_iam_group.example_group.name
  users = [aws_iam_user.example_user.name]
}

# Create an inline policy for the IAM group
resource "aws_iam_group_policy" "example_group_policy" {
  group = aws_iam_group.example_group.name
  name  = "example_group_policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "ec2:DescribeInstances"
      Resource = "*"
    }]
  })
}
