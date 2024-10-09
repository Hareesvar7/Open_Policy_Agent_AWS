
### Rego Policy for IAM Operational Best Practices

Here's a combined OPA policy covering multiple IAM best practices. Each policy checks different aspects of the IAM configuration as outlined in your request.

```rego
package aws_iam_compliance

# 1. Block KMS actions in customer-managed policies
deny[msg] {
    blacklisted_actions = {"kms:DisableKey", "kms:DeleteKey"}
    some action
    action = input.iam_customer_policy.actions[_]
    blacklisted_actions[action]
    msg = sprintf("IAM Customer Policy %v allows blacklisted KMS action %v", [input.iam_customer_policy.name, action])
}

# 2. Ensure IAM External Access Analyzer is enabled
deny[msg] {
    input.iam_external_access_analyzer.enabled == false
    msg = "IAM External Access Analyzer is not enabled"
}

# 3. Ensure IAM groups have users assigned
deny[msg] {
    input.iam_group.members == 0
    msg = sprintf("IAM Group %v does not have any users assigned", [input.iam_group.name])
}

# 4. Block KMS actions in inline policies
deny[msg] {
    blacklisted_actions = {"kms:DisableKey", "kms:DeleteKey"}
    some action
    action = input.iam_inline_policy.actions[_]
    blacklisted_actions[action]
    msg = sprintf("IAM Inline Policy %v allows blacklisted KMS action %v", [input.iam_inline_policy.name, action])
}

# 5. Ensure no inline policies are attached to users
deny[msg] {
    count(input.iam_user.inline_policies) > 0
    msg = sprintf("IAM User %v has inline policies attached, which is not allowed", [input.iam_user.name])
}

# 6. Ensure IAM password policy complies with requirements
deny[msg] {
    not input.iam_password_policy.minimum_length >= 14
    msg = "IAM password policy does not enforce a minimum length of 14 characters"
}
deny[msg] {
    input.iam_password_policy.require_symbols == false
    msg = "IAM password policy does not require symbols"
}
deny[msg] {
    input.iam_password_policy.require_numbers == false
    msg = "IAM password policy does not require numbers"
}

# 7. Ensure IAM policies do not use blacklisted actions
deny[msg] {
    blacklisted_actions = {"s3:PutBucketPolicy", "ec2:TerminateInstances"}
    some action
    action = input.iam_policy.actions[_]
    blacklisted_actions[action]
    msg = sprintf("IAM Policy %v uses blacklisted action %v", [input.iam_policy.name, action])
}

# 8. Ensure IAM policy is in use
deny[msg] {
    input.iam_policy.in_use == false
    msg = sprintf("IAM Policy %v is not currently in use", [input.iam_policy.name])
}

# 9. Ensure no IAM policy has admin access
deny[msg] {
    input.iam_policy.has_admin_access == true
    msg = sprintf("IAM Policy %v has admin access, which is prohibited", [input.iam_policy.name])
}

# 10. Ensure no IAM policy has full access
deny[msg] {
    input.iam_policy.has_full_access == true
    msg = sprintf("IAM Policy %v has full access, which is prohibited", [input.iam_policy.name])
}

# 11. Ensure IAM role only uses managed policies
deny[msg] {
    input.iam_role.has_managed_policy == false
    msg = sprintf("IAM Role %v does not have a managed policy attached", [input.iam_role.name])
}

# 12. Ensure IAM root access key is not active
deny[msg] {
    input.iam_root_access_key.active == true
    msg = "IAM Root Access Key is active, which is prohibited"
}

# 13. Ensure IAM server certificates are not expired
deny[msg] {
    input.iam_server_certificate.expiration < now
    msg = sprintf("IAM Server Certificate %v has expired", [input.iam_server_certificate.name])
}

# 14. Ensure IAM users are part of a group
deny[msg] {
    input.iam_user.groups == 0
    msg = sprintf("IAM User %v is not part of any group", [input.iam_user.name])
}

# 15. Ensure IAM users have MFA enabled
deny[msg] {
    input.iam_user.mfa_enabled == false
    msg = sprintf("IAM User %v does not have MFA enabled", [input.iam_user.name])
}

# 16. Ensure IAM users do not have policies attached
deny[msg] {
    count(input.iam_user.policies) > 0
    msg = sprintf("IAM User %v has policies attached, which is not allowed", [input.iam_user.name])
}

# 17. Ensure IAM users do not have unused credentials
deny[msg] {
    input.iam_user.credentials.last_used == null
    msg = sprintf("IAM User %v has unused credentials", [input.iam_user.name])
}

allow {
    not deny[_]
}
```

### JSON Data to Validate the Policy (Pass)

```json
{
  "iam_customer_policy": {
    "name": "secure-policy",
    "actions": ["s3:ListBucket", "s3:GetObject"]
  },
  "iam_external_access_analyzer": {
    "enabled": true
  },
  "iam_group": {
    "name": "admin-group",
    "members": 5
  },
  "iam_inline_policy": {
    "name": "inline-policy",
    "actions": ["s3:GetObject"]
  },
  "iam_user": {
    "name": "user1",
    "inline_policies": [],
    "groups": 2,
    "mfa_enabled": true,
    "policies": [],
    "credentials": {
      "last_used": "2024-09-30"
    }
  },
  "iam_password_policy": {
    "minimum_length": 14,
    "require_symbols": true,
    "require_numbers": true
  },
  "iam_policy": {
    "name": "restricted-policy",
    "actions": ["s3:GetObject"],
    "in_use": true,
    "has_admin_access": false,
    "has_full_access": false
  },
  "iam_role": {
    "name": "app-role",
    "has_managed_policy": true
  },
  "iam_root_access_key": {
    "active": false
  },
  "iam_server_certificate": {
    "name": "ssl-cert",
    "expiration": "2024-12-31"
  }
}
```

### JSON Data to Fail the Policy (Fail)

```json
{
  "iam_customer_policy": {
    "name": "dangerous-policy",
    "actions": ["kms:DisableKey", "s3:DeleteBucket"]
  },
  "iam_external_access_analyzer": {
    "enabled": false
  },
  "iam_group": {
    "name": "empty-group",
    "members": 0
  },
  "iam_inline_policy": {
    "name": "dangerous-inline-policy",
    "actions": ["kms:DeleteKey"]
  },
  "iam_user": {
    "name": "user2",
    "inline_policies": ["policy1"],
    "groups": 0,
    "mfa_enabled": false,
    "policies": ["policy2"],
    "credentials": {
      "last_used": null
    }
  },
  "iam_password_policy": {
    "minimum_length": 10,
    "require_symbols": false,
    "require_numbers": false
  },
  "iam_policy": {
    "name": "admin-policy",
    "actions": ["s3:GetObject", "s3:PutBucketPolicy"],
    "in_use": false,
    "has_admin_access": true,
    "has_full_access": true
  },
  "iam_role": {
    "name": "app-role",
    "has_managed_policy": false
  },
  "iam_root_access_key": {
    "active": true
  },
  "iam_server_certificate": {
    "name": "expired-cert",
    "expiration": "2022-01-01"
  }
}
```

### How to Evaluate with OPA

Use the following commands to evaluate the compliance of your IAM setup using OPA:

```bash
# For passing case
opa eval -i passing.json -d policy.rego "data.aws_iam_compliance.allow"

# For failing case
opa eval -i failing.json -d policy.rego "data.aws_iam_compliance.allow"
```

This will help you validate IAM configurations against best practices for security and compliance.
