package vpc

# Example policy for VPC flow logs
deny[{"msg": "VPCs must have flow logs enabled."}] {
    not input.vpcs[_].flow_logs_enabled
}
