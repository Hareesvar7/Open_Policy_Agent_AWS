provider "aws" {
  region = "us-west-2"
}

# Create an IAM role for the Lambda function
resource "aws_iam_role" "lambda_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Effect = "Allow"
    }]
  })
}

# Attach AWS managed policy to allow logging
resource "aws_iam_role_policy_attachment" "lambda_logging" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Create a Lambda function
resource "aws_lambda_function" "example_lambda" {
  function_name = "example_lambda_function"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x" # or another runtime

  # Inline code for the Lambda function
  source_code_hash = filebase64sha256("lambda_function.zip")

  # Use the zip file for the Lambda function code
  filename = "lambda_function.zip"

  environment = {
    EXAMPLE_ENV_VAR = "example_value"
  }
}

# Example of creating an API Gateway for the Lambda function
resource "aws_api_gateway_rest_api" "example_api" {
  name        = "example-api"
  description = "API Gateway for example Lambda function"
}

resource "aws_api_gateway_resource" "example_resource" {
  rest_api_id = aws_api_gateway_rest_api.example_api.id
  parent_id   = aws_api_gateway_rest_api.example_api.root_resource_id
  path_part   = "example"
}

resource "aws_api_gateway_method" "example_method" {
  rest_api_id   = aws_api_gateway_rest_api.example_api.id
  resource_id   = aws_api_gateway_resource.example_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "example_integration" {
  rest_api_id = aws_api_gateway_rest_api.example_api.id
  resource_id = aws_api_gateway_resource.example_resource.id
  http_method = aws_api_gateway_method.example_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.example_lambda.invoke_arn
}

# Outputs for easy reference
output "lambda_function_arn" {
  value = aws_lambda_function.example_lambda.arn
}

output "api_endpoint" {
  value = "${aws_api_gateway_rest_api.example_api.execution_arn}/example"
}
