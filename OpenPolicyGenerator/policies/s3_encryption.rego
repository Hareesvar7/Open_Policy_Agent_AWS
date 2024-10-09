package s3

# Example policy for S3 encryption
deny[{"msg": "S3 buckets must have encryption enabled."}] {
    not input.s3_buckets[_].encryption
}
