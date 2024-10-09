Sure! Below are the reusable OPA policies tailored for AWS IAM resources, structured to evaluate the Terraform `plan.json` output based on the specified operational best practices.

### Reusable OPA Policies for AWS IAM

```rego
package aws.iam.policies

# 1. Enforce IAM Customer Policy Blocked KMS Actions
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_policy"
    resource.change.after.blocked_kms_actions[_]
    msg = sprintf("IAM Policy '%s' contains blocked KMS actions", [resource.change.after.name])
}

# 2. Enforce IAM External Access Analyzer must be enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_external_access_analyzer"
    not resource.change.after.enabled
    msg = "IAM External Access Analyzer is not enabled"
}

# 3. Enforce IAM Group Must Have Users
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_group"
    count(resource.change.after.users) == 0
    msg = sprintf("IAM Group '%s' has no users associated", [resource.change.after.name])
}

# 4. Enforce IAM Inline Policy Blocked KMS Actions
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_role"
    resource.change.after.inline_policy_blocked_kms_actions[_]
    msg = sprintf("IAM Role '%s' contains inline policies with blocked KMS actions", [resource.change.after.name])
}

# 5. Enforce No Inline Policies
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_role"
    count(resource.change.after.inline_policies) > 0
    msg = sprintf("IAM Role '%s' has inline policies, which are prohibited", [resource.change.after.name])
}

# 6. Enforce IAM Password Policy
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_account_password_policy"
    not resource.change.after.require_uppercase_characters
    msg = "IAM Password Policy does not require uppercase characters"
}

# 7. Enforce IAM Policy Blacklisted Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_policy"
    resource.change.after.blacklisted_policy == true
    msg = sprintf("IAM Policy '%s' is blacklisted", [resource.change.after.name])
}

# 8. Enforce IAM Policy In Use Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_policy"
    not resource.change.after.in_use
    msg = sprintf("IAM Policy '%s' is not in use", [resource.change.after.name])
}

# 9. Enforce No Admin Access Statements in IAM Policy
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_policy"
    resource.change.after.admin_access_statements[_]
    msg = sprintf("IAM Policy '%s' contains admin access statements", [resource.change.after.name])
}

# 10. Enforce No Full Access Statements in IAM Policy
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_policy"
    resource.change.after.full_access_statements[_]
    msg = sprintf("IAM Policy '%s' contains full access statements", [resource.change.after.name])
}

# 11. Enforce IAM Role Managed Policy Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_role"
    count(resource.change.after.managed_policies) == 0
    msg = sprintf("IAM Role '%s' does not have any managed policies attached", [resource.change.after.name])
}

# 12. Enforce Root Access Key Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_access_key"
    resource.change.after.user == "root"
    msg = "Root access key should not be enabled"
}

# 13. Enforce Server Certificate Expiration Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_server_certificate"
    resource.change.after.expiration < time.now_ns()
    msg = sprintf("IAM Server Certificate '%s' has expired", [resource.change.after.name])
}

# 14. Enforce User Group Membership Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_user"
    count(resource.change.after.groups) == 0
    msg = sprintf("IAM User '%s' is not a member of any group", [resource.change.after.name])
}

# 15. Enforce User MFA Enabled Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_user"
    not resource.change.after.mfa_enabled
    msg = sprintf("MFA is not enabled for IAM User '%s'", [resource.change.after.name])
}

# 16. Enforce User No Policies Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_user"
    count(resource.change.after.policies) > 0
    msg = sprintf("IAM User '%s' should not have policies attached", [resource.change.after.name])
}

# 17. Enforce User Unused Credentials Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_iam_user"
    resource.change.after.unused_credentials == true
    msg = sprintf("IAM User '%s' has unused credentials", [resource.change.after.name])
}

# Allow if no deny conditions are met
allow {
    not deny[_]
}
```

### Explanation of Policy Structure

- Each policy rule checks a specific compliance requirement related to IAM resources.
- The rules are structured to evaluate the changes described in the `resource_changes` array of the `plan.json` generated by Terraform.
- The `deny` statement is used to generate messages when compliance checks fail.
- The `allow` rule permits the resource changes if no deny conditions are triggered.

### Usage

You can run the evaluation against your `plan.json` output file generated from your Terraform plans. The command would look like this:

```bash
opa eval -i plan.json -d policy.rego "data.aws.iam.policies.allow"
```

This format allows you to efficiently integrate these IAM policies within your existing Terraform workflows and ensure that IAM configurations comply with established best practices before deployment.
