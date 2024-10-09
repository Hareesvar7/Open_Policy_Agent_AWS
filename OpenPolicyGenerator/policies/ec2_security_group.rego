package ec2

# Example policy for EC2 security groups
deny[{"msg": "EC2 security groups must restrict all inbound traffic."}] {
    input.security_groups[_].inbound_rules[_].protocol == "all"
}
