provider "aws" {
  region = "us-west-2"
}

# Create an EFS file system
resource "aws_efs_file_system" "example" {
  creation_token = "example-efs"
  encrypted      = true
  performance_mode = "generalPurpose"
  provisioned_throughput_in_mibps = 1024

  lifecycle_policy {
    transition_to_ia = "AFTER_30_DAYS"
  }

  tags = {
    Name        = "example-efs"
    Environment = "development"
  }
}

# Create an EFS access point
resource "aws_efs_access_point" "example" {
  file_system_id = aws_efs_file_system.example.id

  root_directory {
    path = "/example_root"
    creation_info {
      owner_uid = "1001"
      owner_gid = "1001"
      permissions = "750"
    }
  }

  tags = {
    Name        = "example-efs-access-point"
    Environment = "development"
  }
}

# Create an EFS mount target
resource "aws_efs_mount_target" "example" {
  file_system_id = aws_efs_file_system.example.id
  subnet_id      = "<YOUR_SUBNET_ID>" # Replace with your subnet ID

  tags = {
    Name        = "example-efs-mount-target"
    Environment = "development"
  }
}

# Enable automatic backups for EFS
resource "aws_backup_plan" "example" {
  name = "example-backup-plan"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.example.name
    schedule          = "cron(0 12 * * ? *)" # Daily at 12 PM UTC
    lifecycle {
      delete {
        days = 30
      }
    }
  }
}

resource "aws_backup_vault" "example" {
  name = "example-backup-vault"
}

resource "aws_backup_selection" "example" {
  name          = "example-backup-selection"
  backup_plan_id = aws_backup_plan.example.id

  resources = [aws_efs_file_system.example.arn]
}

# Create a security group for the EFS mount target
resource "aws_security_group" "efs_sg" {
  name        = "efs_security_group"
  description = "Allow access to EFS"

  ingress {
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["<YOUR_CIDR_BLOCK>"] # Replace with your CIDR block
  }
}

# Attach the security group to the mount target
resource "aws_efs_mount_target" "secure_example" {
  file_system_id = aws_efs_file_system.example.id
  subnet_id      = "<YOUR_SUBNET_ID>" # Replace with your subnet ID
  security_groups = [aws_security_group.efs_sg.id]
}

