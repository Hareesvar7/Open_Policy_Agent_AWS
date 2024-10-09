package aws_s3_compliance

# 1. Ensure S3 bucket allows only SSL requests
deny[msg] {
    input.s3_bucket.ssl_requests_only == false
    msg = sprintf("S3 Bucket %v does not enforce SSL requests only", [input.s3_bucket.name])
}

# 2. Ensure S3 bucket versioning is enabled
deny[msg] {
    input.s3_bucket.versioning_configuration.status != "Enabled"
    msg = sprintf("S3 Bucket %v does not have versioning enabled", [input.s3_bucket.name])
}

# 3. Ensure S3 bucket default encryption uses KMS
deny[msg] {
    input.s3_bucket.default_encryption != "aws:kms"
    msg = sprintf("S3 Bucket %v does not have KMS encryption enabled", [input.s3_bucket.name])
}

# 4. Ensure S3 bucket event notifications are enabled
deny[msg] {
    input.s3_bucket.event_notifications == null
    msg = sprintf("S3 Bucket %v does not have event notifications enabled", [input.s3_bucket.name])
}

# 5. Ensure the last backup recovery point was created
deny[msg] {
    input.s3_bucket.last_backup == null
    msg = sprintf("S3 Bucket %v does not have a recent backup recovery point", [input.s3_bucket.name])
}

# 6. Ensure S3 bucket lifecycle policy is configured
deny[msg] {
    input.s3_bucket.lifecycle_policy == null
    msg = sprintf("S3 Bucket %v does not have a lifecycle policy configured", [input.s3_bucket.name])
}

# 7. Ensure S3 meets restore time target
deny[msg] {
    input.s3_bucket.restore_time_target == false
    msg = sprintf("S3 Bucket %v does not meet the restore time target", [input.s3_bucket.name])
}

# 8. Ensure S3 resources are logically air-gapped in vault
deny[msg] {
    input.s3_bucket.air_gapped_vault == false
    msg = sprintf("S3 Bucket %v is not stored in a logically air-gapped vault", [input.s3_bucket.name])
}

# 9. Ensure S3 resources are protected by a backup plan
deny[msg] {
    input.s3_bucket.backup_plan_enabled == false
    msg = sprintf("S3 Bucket %v is not protected by a backup plan", [input.s3_bucket.name])
}

# 10. Ensure S3 version lifecycle policy is configured
deny[msg] {
    input.s3_bucket.version_lifecycle_policy == null
    msg = sprintf("S3 Bucket %v does not have a version lifecycle policy", [input.s3_bucket.name])
}

# 11. Ensure S3 Access Point is VPC-only
deny[msg] {
    input.s3_access_point.vpc_configuration == null
    msg = sprintf("S3 Access Point %v is not in a VPC", [input.s3_access_point.name])
}

# 12. Ensure S3 Access Point Public Access Blocks are enabled
deny[msg] {
    input.s3_access_point.public_access_block_configuration == false
    msg = sprintf("S3 Access Point %v does not have public access blocks enabled", [input.s3_access_point.name])
}

# 13. Ensure account-level public access blocks are enabled
deny[msg] {
    input.s3_account.public_access_block_settings.block_public_acls == false
    msg = "Public ACLs are not blocked at the account level"
}

# 14. Ensure account-level public access blocks are periodically checked
deny[msg] {
    input.s3_account.public_access_block_settings.periodic_check == false
    msg = "Public access blocks are not checked periodically at the account level"
}

# 15. Ensure S3 bucket ACL is prohibited
deny[msg] {
    input.s3_bucket.acl != "private"
    msg = sprintf("S3 Bucket %v ACL is %v, must be private", [input.s3_bucket.name, input.s3_bucket.acl])
}

# 16. Ensure blacklisted actions are prohibited
deny[msg] {
    blacklisted_actions = {"s3:DeleteBucket", "s3:PutBucketPolicy"}
    some action
    action = input.s3_bucket_policy.allowed_actions[_]
    action == blacklisted_actions[_]
    msg = sprintf("S3 Bucket %v allows blacklisted action %v", [input.s3_bucket.name, action])
}

# 17. Ensure S3 bucket cross-region replication is enabled
deny[msg] {
    input.s3_bucket.replication_configuration == null
    msg = sprintf("S3 Bucket %v does not have cross-region replication enabled", [input.s3_bucket.name])
}

# 18. Ensure S3 bucket default lock is enabled
deny[msg] {
    input.s3_bucket.object_lock_enabled == false
    msg = sprintf("S3 Bucket %v does not have default object lock enabled", [input.s3_bucket.name])
}

# 19. Ensure bucket-level public access is prohibited
deny[msg] {
    input.s3_bucket.public_access == true
    msg = sprintf("S3 Bucket %v allows public access", [input.s3_bucket.name])
}

# 20. Ensure S3 bucket logging is enabled
deny[msg] {
    input.s3_bucket.logging_configuration == null
    msg = sprintf("S3 Bucket %v does not have logging enabled", [input.s3_bucket.name])
}

# 21. Ensure S3 bucket MFA delete is enabled
deny[msg] {
    input.s3_bucket.mfa_delete == false
    msg = sprintf("S3 Bucket %v does not have MFA delete enabled", [input.s3_bucket.name])
}

# 22. Ensure bucket policy grantee check
deny[msg] {
    not input.s3_bucket_policy.grantee_check
    msg = sprintf("S3 Bucket %v policy grantee check failed", [input.s3_bucket.name])
}

# 23. Ensure bucket policy is not more permissive than necessary
deny[msg] {
    input.s3_bucket_policy.permissive == true
    msg = sprintf("S3 Bucket %v policy is too permissive", [input.s3_bucket.name])
}

# 24. Ensure public-read is prohibited
deny[msg] {
    input.s3_bucket.acl == "public-read"
    msg = sprintf("S3 Bucket %v has public-read access, which is prohibited", [input.s3_bucket.name])
}

# 25. Ensure public-write is prohibited
deny[msg] {
    input.s3_bucket.acl == "public-write"
    msg = sprintf("S3 Bucket %v has public-write access, which is prohibited", [input.s3_bucket.name])
}

# 26. Ensure bucket replication is enabled
deny[msg] {
    input.s3_bucket.replication_configuration == null
    msg = sprintf("S3 Bucket %v replication is not enabled", [input.s3_bucket.name])
}

# 27. Ensure server-side encryption is enabled
deny[msg] {
    input.s3_bucket.server_side_encryption_configuration == null
    msg = sprintf("S3 Bucket %v does not have server-side encryption enabled", [input.s3_bucket.name])
}


