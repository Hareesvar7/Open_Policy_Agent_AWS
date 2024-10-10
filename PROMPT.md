Here are two example prompts that you can use to generate the two Rego policies. 

### Prompt for the Accurate Rego Policy:
**Prompt 1 (Accurate):**
"Generate an OPA policy that enforces AWS Lambda concurrency limits. The policy should check if the resource type is 'aws lambda_function' and whether the concurrency limit is set to 0 for any resource change. If no concurrency limit is set, return a detailed deny message with the name of the Lambda function that does not have a concurrency limit."

### Prompt for the Inaccurate Rego Policy:
**Prompt 2 (Inaccurate):**
"Generate an OPA policy to check the concurrency of an AWS Lambda function. The policy should deny if the function's concurrency exceeds the maximum allowed concurrency."

### Explanation:
1. **Accurate Prompt**: It specifies the resource type (`aws lambda_function`), checks for `resource.change.after.concurrency_limit`, and asks for a detailed deny message. This leads to a more reusable and contextually accurate policy.
2. **Inaccurate Prompt**: This prompt is vague, only asking to check the function’s concurrency against the maximum allowed. It lacks the detail about `resource.type` or how to output a meaningful message.

You can use these prompts to show the difference in policy generation accuracy.
