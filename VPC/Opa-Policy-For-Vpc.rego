package aws.vpc.policies

# 1. Enforce Default Security Group is Closed
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_vpc"
    resource.change.after.default_security_group_open
    msg = sprintf("Default security group in VPC '%s' is not closed", [resource.change.after.name])
}

# 2. Enforce VPC Flow Logs Enabled
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_vpc"
    not resource.change.after.enable_flow_logs
    msg = sprintf("VPC '%s' does not have flow logs enabled", [resource.change.after.name])
}

# 3. Enforce Network ACL Unused Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_network_acl"
    resource.change.after.is_used == false
    msg = sprintf("Network ACL '%s' is not in use", [resource.change.after.name])
}

# 4. Enforce VPC Peering DNS Resolution Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_vpc_peering_connection"
    not resource.change.after.allow_dns_resolution
    msg = sprintf("VPC Peering Connection '%s' does not allow DNS resolution", [resource.change.after.name])
}

# 5. Enforce Security Group Open Only to Authorized Ports
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_security_group"
    resource.change.after.allowed_ports[_] not in ["22", "80", "443"]
    msg = sprintf("Security Group '%s' allows access to unauthorized port '%s'", [resource.change.after.name, resource.change.after.allowed_ports[_]])
}

# 6. Enforce Security Group Port Restriction Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_security_group"
    resource.change.after.allowed_ports[_] == "0"
    msg = sprintf("Security Group '%s' allows traffic on all ports (0)", [resource.change.after.name])
}

# 7. Enforce VPN Tunnels Status Check
deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_vpn_connection"
    count(resource.change.after.tunnel_status) < 2
    msg = sprintf("VPN Connection '%s' does not have both tunnels up", [resource.change.after.name])
}

