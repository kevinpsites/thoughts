resource "aws_lambda_function" "thoughts_be" {
  function_name = "ThoughtsBE"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_index_function.key

  runtime = "nodejs14.x"
  handler = "index.handler"

  source_code_hash = data.archive_file.lambda_index_function.output_base64sha256

  role = aws_iam_role.lambda_exec.arn

  layers = [aws_lambda_layer_version.lambda_api_layer.arn, aws_lambda_layer_version.axios_layer.arn]

  environment {
    variables = {
      AIR_TABLE_KEY     = var.air_table_key
      AIR_TABLE_PROJECT = var.air_table_project
    }
  }

  timeout = 30
}

resource "aws_cloudwatch_log_group" "thoughts_be" {
  name = "/aws/lambda/${aws_lambda_function.thoughts_be.function_name}"

  retention_in_days = 3
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_layer_version" "lambda_api_layer" {
  filename   = "${path.module}/../layers/lambdaApi.zip"
  layer_name = "lambda_api"

  compatible_runtimes = ["nodejs14.x"]
}

resource "aws_lambda_layer_version" "axios_layer" {
  filename   = "${path.module}/../layers/axios.zip"
  layer_name = "axios2"

  compatible_runtimes = ["nodejs14.x"]
}
