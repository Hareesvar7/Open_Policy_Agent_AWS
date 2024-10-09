Certainly! Below is a reusable OPA policy tailored for AWS S3 resources, structured to evaluate the Terraform `plan.json` output based on the specified operational best practices. The policies will assess resource changes in the Terraform plan and generate appropriate denial messages if compliance requirements are not met.

### Reusable OPA Policies for AWS S3

```rego
package aws.s3.policies

# 1. Enforce S3 Access Point must be VPC only
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_access_point"
    resource.change.after.vpc_configuration == null
    msg = sprintf("S3 Access Point '%s' is not configured to be VPC only", [resource.change.after.name])
}

# 2. Enforce S3 Access Point Public Access Blocks must be set
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_access_point"
    not resource.change.after.public_access_block.enabled
    msg = sprintf("Public Access Block is not enabled for S3 Access Point '%s'", [resource.change.after.name])
}

# 3. Enforce Account-level public access blocks must be configured
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_account"
    not resource.change.after.public_access_block.enabled
    msg = "Account-level Public Access Block is not enabled"
}

# 4. Enforce Bucket ACL must be prohibited
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.acl != "private"
    msg = sprintf("S3 Bucket '%s' has ACL set to '%s', which is prohibited", [resource.change.after.name, resource.change.after.acl])
}

# 5. Enforce Bucket must not allow blacklisted actions
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.blacklisted_actions[_]
    msg = sprintf("S3 Bucket '%s' has blacklisted actions configured", [resource.change.after.name])
}

# 6. Enforce Bucket Cross-Region Replication must be enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.replication.enabled
    msg = sprintf("Cross-Region Replication is not enabled for S3 Bucket '%s'", [resource.change.after.name])
}

# 7. Enforce Bucket default lock must be enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.default_lock.enabled
    msg = sprintf("Default Lock is not enabled for S3 Bucket '%s'", [resource.change.after.name])
}

# 8. Enforce Bucket Level Public Access must be prohibited
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.public_access == true
    msg = sprintf("Public Access is enabled for S3 Bucket '%s', which is prohibited", [resource.change.after.name])
}

# 9. Enforce Bucket Logging must be enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.logging.enabled
    msg = sprintf("Logging is not enabled for S3 Bucket '%s'", [resource.change.after.name])
}

# 10. Enforce MFA Delete must be enabled for Buckets
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.mfa_delete.enabled
    msg = sprintf("MFA Delete is not enabled for S3 Bucket '%s'", [resource.change.after.name])
}

# 11. Enforce Bucket Policy must have grantee checks
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.policy_grantee_check == false
    msg = sprintf("Bucket Policy Grantee Check failed for S3 Bucket '%s'", [resource.change.after.name])
}

# 12. Enforce Bucket Policy must not be more permissive
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.policy_not_more_permissive == false
    msg = sprintf("Bucket Policy is more permissive for S3 Bucket '%s'", [resource.change.after.name])
}

# 13. Enforce Public Read must be prohibited
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.public_read == true
    msg = sprintf("Public Read access is enabled for S3 Bucket '%s', which is prohibited", [resource.change.after.name])
}

# 14. Enforce Public Write must be prohibited
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.public_write == true
    msg = sprintf("Public Write access is enabled for S3 Bucket '%s', which is prohibited", [resource.change.after.name])
}

# 15. Enforce Bucket Server-Side Encryption must be enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    resource.change.after.server_side_encryption == false
    msg = sprintf("Server-Side Encryption is not enabled for S3 Bucket '%s'", [resource.change.after.name])
}

# Allow if no deny conditions are met
allow {
    not deny[_]
}
```

### Explanation of Policy Structure

- Each policy rule checks a specific compliance requirement related to S3 resources.
- The rules are structured to evaluate the changes described in the `resource_changes` array of the `plan.json` generated by Terraform.
- The `deny` statement is used to generate messages when the compliance checks fail.
- The `allow` rule permits the resource changes if no deny conditions are triggered.

### Usage

You can run the evaluation against your `plan.json` output file generated from your Terraform plans. The command would look like this:

```bash
opa eval -i plan.json -d policy.rego "data.aws.s3.policies.allow"
```

This approach allows for flexible integration of the policy checks within your existing Terraform workflows and ensures that your S3 configurations comply with established best practices before deployment.
