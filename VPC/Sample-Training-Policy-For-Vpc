### Rego Policy for VPC Operational Best Practices

Here's a combined OPA policy that enforces compliance with the specified best practices for AWS VPC. Each policy covers a specific aspect of VPC security and operational checks.

```rego
package aws_vpc_compliance

# 1. Default security group must be closed
deny[msg] {
    input.vpc_security_group.is_default == true
    count(input.vpc_security_group.ingress_rules) > 0
    msg = sprintf("VPC Default Security Group %v has ingress rules, which is prohibited", [input.vpc_security_group.id])
}

# 2. VPC Flow Logs must be enabled
deny[msg] {
    input.vpc_flow_logs.enabled == false
    msg = sprintf("VPC Flow Logs are not enabled for VPC %v", [input.vpc.id])
}

# 3. Unused Network ACLs should be flagged
deny[msg] {
    input.vpc_network_acl.associated_subnets == 0
    msg = sprintf("VPC Network ACL %v is not associated with any subnets", [input.vpc_network_acl.id])
}

# 4. Ensure VPC peering connections have DNS resolution enabled
deny[msg] {
    input.vpc_peering.dns_resolution == false
    msg = sprintf("VPC Peering connection %v does not have DNS resolution enabled", [input.vpc_peering.id])
}

# 5. Security group must only allow authorized ports
deny[msg] {
    allowed_ports = {22, 80, 443}
    some ingress
    ingress = input.vpc_security_group.ingress_rules[_]
    not allowed_ports[ingress.port]
    msg = sprintf("Security Group %v allows unauthorized port %v", [input.vpc_security_group.id, ingress.port])
}

# 6. Restrict open ports in Security Groups
deny[msg] {
    some ingress
    ingress = input.vpc_security_group.ingress_rules[_]
    ingress.cidr_block == "0.0.0.0/0"
    not {22, 80, 443}[ingress.port]
    msg = sprintf("Security Group %v allows port %v open to the world, which is restricted", [input.vpc_security_group.id, ingress.port])
}

# 7. VPN must have 2 tunnels up
deny[msg] {
    input.vpc_vpn.tunnels_up < 2
    msg = sprintf("VPN connection %v does not have both tunnels up", [input.vpc_vpn.id])
}

allow {
    not deny[_]
}
```

### JSON Data to Validate the Policy (Pass)

```json
{
  "vpc_security_group": {
    "id": "sg-123456",
    "is_default": false,
    "ingress_rules": [
      { "port": 22, "cidr_block": "192.168.1.0/24" },
      { "port": 443, "cidr_block": "192.168.1.0/24" }
    ]
  },
  "vpc_flow_logs": {
    "enabled": true
  },
  "vpc_network_acl": {
    "id": "acl-123456",
    "associated_subnets": 2
  },
  "vpc_peering": {
    "id": "pcx-123456",
    "dns_resolution": true
  },
  "vpc_vpn": {
    "id": "vpn-123456",
    "tunnels_up": 2
  }
}
```

### JSON Data to Fail the Policy (Fail)

```json
{
  "vpc_security_group": {
    "id": "sg-654321",
    "is_default": true,
    "ingress_rules": [
      { "port": 3306, "cidr_block": "0.0.0.0/0" },
      { "port": 22, "cidr_block": "0.0.0.0/0" }
    ]
  },
  "vpc_flow_logs": {
    "enabled": false
  },
  "vpc_network_acl": {
    "id": "acl-654321",
    "associated_subnets": 0
  },
  "vpc_peering": {
    "id": "pcx-654321",
    "dns_resolution": false
  },
  "vpc_vpn": {
    "id": "vpn-654321",
    "tunnels_up": 1
  }
}
```

### How to Evaluate with OPA

To evaluate these policies using the `opa eval` command:

- For the passing case:
  ```bash
  opa eval -i passing.json -d policy.rego "data.aws_vpc_compliance.allow"
  ```

- For the failing case:
  ```bash
  opa eval -i failing.json -d policy.rego "data.aws_vpc_compliance.allow"
  ```

This approach ensures that your VPC configurations align with AWS best practices and operational security requirements.
