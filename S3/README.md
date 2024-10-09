Here’s a set of reusable OPA policies for AWS S3, structured to evaluate the Terraform `plan.json` output based on the specified operational best practices. The policies are designed to be applicable to your Terraform setup and to provide meaningful outputs when evaluated.

### Reusable OPA Policies for AWS S3

```rego
package aws.s3.policies

# 1. Enforce S3 Access Points in VPC Only
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_access_point"
    not resource.change.after.vpc_configuration
    msg = sprintf("S3 Access Point '%s' must be configured in a VPC", [resource.change.after.name])
}

# 2. Enforce Public Access Blocks on S3 Access Points
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_access_point"
    not resource.change.after.public_access_block
    msg = sprintf("S3 Access Point '%s' must have public access blocks enabled", [resource.change.after.name])
}

# 3. Enforce Account-Level Public Access Blocks
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.account_level_public_access_block
    msg = sprintf("S3 bucket '%s' must have account-level public access blocks enabled", [resource.change.after.bucket])
}

# 4. Prohibit ACLs on S3 Buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.acl != "private"
    msg = sprintf("S3 bucket '%s' must not use ACLs", [resource.change.after.bucket])
}

# 5. Prohibit Blacklisted Actions on S3 Buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    action := resource.change.after.blacklisted_actions[_]
    msg = sprintf("S3 bucket '%s' contains blacklisted action '%s'", [resource.change.after.bucket, action])
}

# 6. Enforce Cross-Region Replication Enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.cross_region_replication.enabled
    msg = sprintf("S3 bucket '%s' must have cross-region replication enabled", [resource.change.after.bucket])
}

# 7. Enforce Default Lock on S3 Buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.default_lock.enabled
    msg = sprintf("S3 bucket '%s' must have default lock enabled", [resource.change.after.bucket])
}

# 8. Prohibit Public Access at the Bucket Level
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.public_access_block.allow_public_acls == true
    msg = sprintf("S3 bucket '%s' must not allow public ACLs", [resource.change.after.bucket])
}

# 9. Enforce Bucket Logging Enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.logging.enabled
    msg = sprintf("S3 bucket '%s' must have logging enabled", [resource.change.after.bucket])
}

# 10. Enforce MFA Delete on S3 Buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.mfa_delete.enabled
    msg = sprintf("S3 bucket '%s' must have MFA Delete enabled", [resource.change.after.bucket])
}

# 11. Enforce Server-Side Encryption Enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.server_side_encryption.enabled
    msg = sprintf("S3 bucket '%s' must have server-side encryption enabled", [resource.change.after.bucket])
}

# 12. Enforce SSL Requests Only
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.ssl_requests_only
    msg = sprintf("S3 bucket '%s' must enforce SSL requests only", [resource.change.after.bucket])
}

# 13. Enforce Versioning Enabled on S3 Buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.versioning.enabled
    msg = sprintf("S3 bucket '%s' must have versioning enabled", [resource.change.after.bucket])
}

# 14. Enforce KMS Encryption for Default Encryption
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.default_encryption.kms_key_id
    msg = sprintf("S3 bucket '%s' must use KMS for default encryption", [resource.change.after.bucket])
}

# 15. Enforce Event Notifications Enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.event_notifications
    msg = sprintf("S3 bucket '%s' must have event notifications enabled", [resource.change.after.bucket])
}

# 16. Enforce Last Backup Recovery Point Created
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.last_backup_recovery_point
    msg = sprintf("S3 bucket '%s' must have a last backup recovery point created", [resource.change.after.bucket])
}

# 17. Enforce Lifecycle Policy Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.lifecycle_policy
    msg = sprintf("S3 bucket '%s' must have a lifecycle policy configured", [resource.change.after.bucket])
}

# 18. Enforce Restore Time Target
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.restore_time_target > 24
    msg = sprintf("S3 bucket '%s' must meet restore time target of 24 hours or less", [resource.change.after.bucket])
}

# 19. Enforce Air-Gapped Vault for S3 Resources
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.logically_air_gapped
    msg = sprintf("S3 bucket '%s' must be in a logically air-gapped vault", [resource.change.after.bucket])
}

# 20. Enforce Backup Plan Protection for S3 Resources
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.backup_plan_protection
    msg = sprintf("S3 bucket '%s' must be protected by a backup plan", [resource.change.after.bucket])
}

# 21. Enforce Version Lifecycle Policy Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.version_lifecycle_policy
    msg = sprintf("S3 bucket '%s' must have a version lifecycle policy configured", [resource.change.after.bucket])
}

# Allow if no deny conditions are met
allow {
    not deny[_]
}
```

### Explanation of Policy Structure

- Each policy rule checks for a specific compliance requirement related to S3 resources.
- The rules evaluate the changes described in the `resource_changes` array of the `plan.json` generated by Terraform.
- The `deny` statement is used to generate messages when compliance checks fail.
- The `allow` rule permits the resource changes if no deny conditions are triggered.

### Usage

To evaluate these policies against your `plan.json` output, use the following command:

```bash
opa eval -i plan.json -d policy.rego "data.aws.s3.policies.deny"
```

This structure allows you to efficiently integrate these S3 policies within your existing Terraform workflows and ensure that S3 configurations comply with established best practices before deployment.
