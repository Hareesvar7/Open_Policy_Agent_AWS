Here’s a set of reusable OPA policies for AWS EKS (Elastic Kubernetes Service), structured to evaluate the Terraform `plan.json` output based on the specified operational best practices. The policies are designed to be applicable to your Terraform setup and to provide meaningful outputs when evaluated.

### Reusable OPA Policies for AWS EKS

```rego
package aws.eks.policies

# 1. Enforce EKS Cluster Logging Enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_eks_cluster"
    not resource.change.after.logging.enabled
    msg = sprintf("EKS cluster '%s' must have logging enabled", [resource.change.after.name])
}

# 2. Enforce Specific EKS Cluster Logs Enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_eks_cluster"
    log := resource.change.after.logging.cluster_logs[_]
    not log.enabled
    msg = sprintf("EKS cluster '%s' must have required logs enabled: %s", [resource.change.after.name, log.types])
}

# 3. Enforce EKS Cluster Using Oldest Supported Version
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_eks_cluster"
    resource.change.after.version < "1.21"  # Example version; adjust based on your compliance requirements
    msg = sprintf("EKS cluster '%s' must be using a supported version. Upgrade to at least '1.21'.", [resource.change.after.name])
}

# 4. Enforce Secrets Encryption for EKS Cluster
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_eks_cluster"
    not resource.change.after.encryption_config
    msg = sprintf("EKS cluster '%s' must have secrets encryption enabled", [resource.change.after.name])
}

# 5. Enforce EKS Cluster Supported Version
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_eks_cluster"
    not resource.change.after.version in ["1.21", "1.22", "1.23"]  # List the supported versions here
    msg = sprintf("EKS cluster '%s' must be using a supported version", [resource.change.after.name])
}

# 6. Enforce No Public Access to EKS Endpoint
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_eks_cluster"
    resource.change.after.endpoint_public_access == true
    msg = sprintf("EKS cluster '%s' must not allow public access to the endpoint", [resource.change.after.name])
}

# 7. Enforce Secrets Encrypted for EKS
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_eks_cluster"
    not resource.change.after.secrets_encryption
    msg = sprintf("EKS cluster '%s' must ensure secrets are encrypted", [resource.change.after.name])
}

# Allow if no deny conditions are met
allow {
    not deny[_]
}
```

### Explanation of Policy Structure

- Each policy rule checks for a specific compliance requirement related to EKS resources.
- The rules evaluate the changes described in the `resource_changes` array of the `plan.json` generated by Terraform.
- The `deny` statement is used to generate messages when compliance checks fail.
- The `allow` rule permits the resource changes if no deny conditions are triggered.

### Usage

To evaluate these policies against your `plan.json` output, use the following command:

```bash
opa eval -i plan.json -d policy.rego "data.aws.eks.policies.allow"
```

### Adjustments

- You may need to adjust the specific version numbers and logging settings in the policies based on your organizational requirements and AWS EKS standards.
- Ensure that the messages in the `sprintf` function reflect the context of your policies accurately.

This structure allows you to efficiently integrate these EKS policies within your existing Terraform workflows and ensure that EKS configurations comply with established best practices before deployment.
