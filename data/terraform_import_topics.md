---
id: 4
title: "terraformの構文とかまとめ"
date: "2023-11-21"
image: "/images/terraform.png"
excerpt: "terraformの基本構文などをざっくりとまとめてみました"
---

現場でterraformでのIaCを経験したのでざっくりメモです

## 複数アカウントの切り替え

AWS cliのconfigure登録でアカウントごとに`--profile`オプションをつけて作成する
`export AWS_DEFAULT_PROFILE=prod`などで切り替え

```bash
$ aws configure --profile <YOUR_PROFIlE_ID>

AWS Access Key ID [None]: <YOUR_ACCESS_KEY>
AWS Secret Access Key [None]: <YOUR_SECRET_ACCESS_KEY>
Default region name [None]: <YOUR_REGION>
Default output format [None]:
```

```bash
$ export AWS_DEFAULT_PROFILE=prod
```

他にもワークスペース機能を活用したり出来るらしい(まだ使用したことが無いです…)

- [複数アカウントや環境の切り替えに Terraform の WorkSpaces を使ってみた](https://sadayoshi-tada.hatenablog.com/entry/2020/06/08/080000)


## terraformコマンド操作説明

初期化　Terraformで新しく設定を記述した場合、初期化を行う必要があります。

```bash
$ terraform init
```

確認(所謂dry-run)
実行計画の確認ができます

```bash
$ terraform plan
```

適用
```bash
$ terraform apply
```

terraform管理下のリソースすべて消去する
```bash
$ terraform destroy
```

リソースの閲覧
```bash
$ terraform show
```

## 既存環境 import

※terraform varsion1.5から下記手順とは異なる方法でインポートできるようになりました
- [Terraform 1.5 で追加される import ブロックの使い方](https://zenn.dev/kou_pg_0131/articles/tf-import-block)

### インポート手順 lambdaの例

必要最低限のtfファイルを作る

```json
resource "aws_lambda_function" "cognito_login" {
}
```

#### Webコンソールで作成したリソースをimport

terraform import 取り込みたいサービス名.インポートしたい名前 AWSにあるリソース　のような形で実行します
lambdaの例だと下記のようになります

```bash
$ terraform import aws_lambda_function.<インポートしたい名前>　<すでにAWS上で作成されているLambda関数名>
```

##### インポートする際の注意点
一点注意して頂きたいのはリソースごとにインポートコマンドの書き方が異なります。
先ほどのlambdaの場合はコマンドの末尾にlambda関数の名前を入力していましたが、
例えばEC2インスタンスの場合は、以下のようにコマンドの末尾にはインスタンスのidを入力します<br>
```bash
$ terraform import aws_instance.web i-12345678
```
参照：https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance#import <br>
インポートのコマンドはリソースごとに調べて実行しましょう

import後に`terraform state list`コマンドで取り込んだリソースの名前を取得し、`terraform state show`コマンドでリソースの情報が見れる

```bash
$ terraform state list

aws_lambda_function.cognito_login

$ terraform state show aws_lambda_function.cognito_login
```

```json
resource "aws_lambda_function" "cognito_login" {
    architectures                  = [
        "x86_64",
    ]
    arn                            = "arn:aws:lambda:ap-northeast-1:************:function:cognito"
    function_name                  = "cognito"
    handler                        = "lambda_function.lambda_handler"
    id                             = "cognito"
    invoke_arn                     = "arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-northeast-1:************:function:cognito/invocations"
    last_modified                  = "2025-11-09T00:00:00.000+0000"
    layers                         = []
    memory_size                    = 128
    package_type                   = "Zip"
    qualified_arn                  = "arn:aws:lambda:ap-northeast-1:************:function:cognito:$LATEST"
    reserved_concurrent_executions = -1
    role                           = "arn:aws:iam::************:role/service-role/cognito-role-n44l3fff"
    runtime                        = "python3.9"
    source_code_hash               = "qUoU5sSYPTtEdpRr456MYKgW4MOCSaedddKZj0ebKLkk="
    source_code_size               = 2000
    tags                           = {}
    tags_all                       = {}
    timeout                        = 3
    version                        = "$LATEST"

    timeouts {}

    tracing_config {
        mode = "PassThrough"
    }
}

```

こちらを上記の.tfファイルにコピペし、いらない箇所や環境によるものの値を修正していく

修正が終わったら`terraform plan`を実行し、`No changes.`と出れば差分なくインポート完了です

### Git BashでTerraform importしたときにパスが勝手に変換されてエラーになる場合の対処法

windowsのgitbashで作業していたら遭遇したバグ

- [Git BashでTerraform importしたときにパスが勝手に変換されてエラーになる場合の対処法](https://zenn.dev/yish/articles/f1689985ebf645)

## tfstateについて

terraformには状態管理のためのtfstateというファイルがあります。
ローカルで管理するか、S3などのウェブ上で管理するか選べます。
下記の設定はローカルで保存。

```json
terraform {
  backend "local" {
    path = "./terraform.tfstate"
  }
}
```

s3保存にする場合の例
事前にs3バケットを作成する必要あり

```json
terraform {
  backend "s3" {
    bucket  = "test-terraform-tfstate"
    region  = "ap-northeast-1"
    key     = "terraform.tfstate"
    encrypt = false
    shared_credentials_file = "$HOME/.aws/credentials"
  }
}
```

## s3バケット作成と同時にローカルのファイルアップロード

s3にバケット作成と同時にファイルアップロードをしたい時があります
下記のように書けます

```json
resource "aws_s3_bucket" "aws_s3_bucket" {
  bucket              = "test_aws_s3_bucket"
  object_lock_enabled = false
  tags                = {}
  tags_all            = {}
  force_destroy       = null
}

resource "aws_s3_object" "test_file_upload" {
  bucket = aws_s3_bucket.aws_s3_bucket.bucket_name
  key    = "test.json"
  source = "./test.json"
}
```

## リソースを作るかどうかを動的に制御したい

countを使ってtrue,falseの条件式が書けます
下記はapigatawayのリソースポリシーをつけるか付けないかの例
`var.api_gateway_is_resource_policy`の値が`true`ならこのリソースは作られることになります

```json
resource "aws_api_gateway_rest_api_policy" "api_policy" {
  count = var.api_gateway_is_resource_policy ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.test_api.id
  policy = jsonencode({
    Statement = [
      {
        Action = "execute-api:Invoke"
        Condition = {
          NotIpAddress = {
            "aws:SourceIp" = [for ip in var.ip_list : ip]
          }
        }
        Effect    = "Deny"
        Principal = "*"
        Resource  = "arn:aws:execute-api:*:*:*"
      },
      {
        Action    = "execute-api:Invoke"
        Effect    = "Allow"
        Principal = "*"
        Resource  = "arn:aws:execute-api:*:*:*"
      },
    ]
    Version = "2012-10-17"
  })
}
```

## terraformで管理したくないけどリソースの情報が欲しい

importしてしまうと削除時に一緒に消えちゃってまずいとかのリソースを情報だけ引っ張りたい時に使います
下記の場合importしていない為、`terraform destroy`コマンドを実行してもroute53のリソースは消えません

```json
data "aws_route53_zone" "host_domain" {
  name = var.domain_name
}

resource "aws_route53_record" "test_record" {
  name    = var.sub_domain_name
  type    = "A"

  # ↓ 下記のような形でimportを行わなくても情報の参照ができる
  zone_id = data.aws_route53_zone.host_domain.zone_id
  alias {
    name                   = aws_api_gateway_domain_name.api_gateway_domain_name.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_gateway_domain_name.regional_zone_id
    evaluate_target_health = true
  }
}
```

### 依存関係を明示的に指定したい

あるリソースの方が先に作って欲しい時に使用します
depends_onにリソースを書いておきます

```json
resource "aws_api_gateway_deployment" "test_api_deployment" {
  depends_on = [
    module.lambda_login
  ]
  rest_api_id = aws_api_gateway_rest_api.test_api.id
  triggers = {
    redeployment = filebase64("./api-gateway.tf")
  }
}
```