### Rego Policy for AWS S3 Operational Best Practices

Below is a set of reusable OPA policies tailored for AWS S3 services, structured to align with the specified operational best practices. These policies can be used to evaluate the compliance of your AWS infrastructure as represented in JSON format, which you would generate from your Terraform files.

```rego
package aws_s3_compliance

# 1. S3 Access Point must be VPC only
deny[msg] {
    input.access_points[_].vpc_configuration == null
    msg = sprintf("S3 Access Point %v is not configured to be VPC only", [input.access_points[_].name])
}

# 2. S3 Access Point Public Access Blocks must be set
deny[msg] {
    not input.access_points[_].public_access_block.enabled
    msg = sprintf("Public Access Block is not enabled for S3 Access Point %v", [input.access_points[_].name])
}

# 3. Account-level public access blocks must be configured
deny[msg] {
    not input.account.public_access_block.enabled
    msg = "Account-level Public Access Block is not enabled"
}

# 4. Bucket ACL must be prohibited
deny[msg] {
    input.buckets[_].acl != "private"
    msg = sprintf("S3 Bucket %v has ACL set to %v, which is prohibited", [input.buckets[_].name, input.buckets[_].acl])
}

# 5. Bucket must not allow blacklisted actions
deny[msg] {
    input.buckets[_].blacklisted_actions[_]
    msg = sprintf("S3 Bucket %v has blacklisted actions configured", [input.buckets[_].name])
}

# 6. Bucket Cross-Region Replication must be enabled
deny[msg] {
    not input.buckets[_].replication.enabled
    msg = sprintf("Cross-Region Replication is not enabled for S3 Bucket %v", [input.buckets[_].name])
}

# 7. Bucket default lock must be enabled
deny[msg] {
    not input.buckets[_].default_lock.enabled
    msg = sprintf("Default Lock is not enabled for S3 Bucket %v", [input.buckets[_].name])
}

# 8. Bucket Level Public Access must be prohibited
deny[msg] {
    input.buckets[_].public_access == true
    msg = sprintf("Public Access is enabled for S3 Bucket %v, which is prohibited", [input.buckets[_].name])
}

# 9. Bucket Logging must be enabled
deny[msg] {
    not input.buckets[_].logging.enabled
    msg = sprintf("Logging is not enabled for S3 Bucket %v", [input.buckets[_].name])
}

# 10. MFA Delete must be enabled for Buckets
deny[msg] {
    not input.buckets[_].mfa_delete.enabled
    msg = sprintf("MFA Delete is not enabled for S3 Bucket %v", [input.buckets[_].name])
}

# 11. Bucket Policy must have grantee checks
deny[msg] {
    input.buckets[_].policy_grantee_check == false
    msg = sprintf("Bucket Policy Grantee Check failed for S3 Bucket %v", [input.buckets[_].name])
}

# 12. Bucket Policy must not be more permissive
deny[msg] {
    input.buckets[_].policy_not_more_permissive == false
    msg = sprintf("Bucket Policy is more permissive for S3 Bucket %v", [input.buckets[_].name])
}

# 13. Public Read must be prohibited
deny[msg] {
    input.buckets[_].public_read == true
    msg = sprintf("Public Read access is enabled for S3 Bucket %v, which is prohibited", [input.buckets[_].name])
}

# 14. Public Write must be prohibited
deny[msg] {
    input.buckets[_].public_write == true
    msg = sprintf("Public Write access is enabled for S3 Bucket %v, which is prohibited", [input.buckets[_].name])
}

# 15. Bucket Server-Side Encryption must be enabled
deny[msg] {
    input.buckets[_].server_side_encryption == false
    msg = sprintf("Server-Side Encryption is not enabled for S3 Bucket %v", [input.buckets[_].name])
}

allow {
    not deny[_]
}
```

### JSON Structure for Terraform Outputs

You can structure your JSON output from Terraform to comply with the requirements of these policies. Below is an example of how this JSON could be structured based on a typical Terraform configuration for S3 resources.

#### Example JSON Output Structure

```json
{
  "access_points": [
    {
      "name": "my-access-point",
      "vpc_configuration": {
        "vpc_id": "vpc-1234567890"
      },
      "public_access_block": {
        "enabled": true
      }
    }
  ],
  "account": {
    "public_access_block": {
      "enabled": true
    }
  },
  "buckets": [
    {
      "name": "my-bucket",
      "acl": "private",
      "blacklisted_actions": [],
      "replication": {
        "enabled": true
      },
      "default_lock": {
        "enabled": true
      },
      "public_access": false,
      "logging": {
        "enabled": true
      },
      "mfa_delete": {
        "enabled": true
      },
      "policy_grantee_check": true,
      "policy_not_more_permissive": true,
      "public_read": false,
      "public_write": false,
      "server_side_encryption": true
    }
  ]
}
```

### Usage with Terraform

You can output your Terraform configurations to JSON format using the command:

```bash
terraform show -json > output.json
```

Then, you can evaluate the compliance of your AWS S3 resources by executing the OPA policy against the JSON file generated from Terraform:

```bash
opa eval -i output.json -d policy.rego "data.aws_s3_compliance.allow"
```

This allows for dynamic evaluation of your S3 configurations against established compliance rules, ensuring that your infrastructure remains secure and adheres to best practices.
