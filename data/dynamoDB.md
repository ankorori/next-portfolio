---
id: 2
title: "node.jsでのdynamodb操作まとめ"
date: "2023-11-21"
image: "/images/pic5.jpg"
excerpt: "aaaaa"
---

node.jsでのdynamodb操作操作をする機会があったため、各種操作方法をまとめておきます。
環境は以下です。

- node.js v18
- aws sdk v3

## 公式サイト

https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/

https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html

## 想定するDynamoDBスキーマ

- パーティションキー
    - AccountType
- ソートキー
    - user_id
- 属性
    - role_id

## 共通

DynamoDBClientのみで頑張って書いても大丈夫ですが型定義など書かないといけないのでめんどくさいです。
DocumentClientを使うとスッキリかけます。
詳しくは公式サイトを確認してください。

```JavaScript
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};
const translateConfig = { marshallOptions };
const DynamoDBclient = new DynamoDBClient({
    region: 'ap-northeast-1'
});
const dynamo = DynamoDBDocumentClient.from( DynamoDBclient, translateConfig );

```

## 検索系

GetCommand、QueryCommand、ScanCommandがあります。
ScanCommandはテーブルフルスキャンになり効率が悪い為あまりおすすめしませんのでここでは解説しません。
DynamoDBは検索条件がそこまで柔軟ではなく、テーブル設計時に検索条件を意識して作る必要があります。
パーティションキーは必ず検索条件に指定する必要があります。デフォルトの設定ではソートキーのみを検索条件にすることはできません。
パーティションキーには、完全一致条件のみ指定できます。

### GetCommand

単一Itemの取得用
パーティションキーとソートキーどちらも設定されている場合はKeyにどちらの項目も必須です。
パーティションキーのみ設定されているテーブルの場合は、パーティションキーは必須です。

```JavaScript
const dynamo_data = await dynamo.send(
    new GetCommand({
        TableName: "tableName",
        Key: {
            AccountType: "ADMIN",
            user_id: "1",
        },
    })
);
```

### QueryCommand

複数のItem取得用
パーティションキーとソートキーが設定されているテーブルの場合パーティションキーは必須項目になります。
呼び出しあたりのデータサイズ制限があり、1MBまでしか転送できません。

```JavaScript
const user_data = await dynamo.send(
    new QueryCommand({
        TableName: "tableName",
        KeyConditionExpression: 'AccountType = :AccountType',
        // プレースフォルダみたいなやつ
        ExpressionAttributeValues: {
            ":AccountType": "ADMIN",
            ":role_id": "role_admin"
        },
        // 属性でフィルターかけたい時に使う。下記だとrole_idが"role_admin"で始まるものを検索
        FilterExpression: "contains (#role_id, :role_id)",
        // dynamodbの予約語に引っかかる時に使う
        ExpressionAttributeNames: {
            "#role_id": "role_id"
        },
        // 検索結果でuser_idしか返して欲しくない時とかに指定
        // この指定がない場合はすべての項目の取得ができる
        // データ転送の節約のため、指定することを推奨
        ProjectionExpression: 'user_id',
    })
);
```

## pagenetion

DynamoDBでは一度に取得できるデータ量が決まっているため、
QueryCommandなどで取得できない場合に使う
sdk v2では もうちょっと冗長な書き方しかできなかった模様

```JavaScript

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};
const translateConfig = { marshallOptions };
const DynamoDBclient = new DynamoDBClient({
    region: 'ap-northeast-1'
});

const dynamo = new DynamoDBDocumentClient(DynamoDBclient, translateConfig);
const paginatorConfig = {
    client: dynamo,
    pageSize: 10,
};
const paginator = paginateQuery(paginatorConfig, {
        TableName: "tableName",
        KeyConditionExpression: 'AccountType = :AccountType',
        ExpressionAttributeValues: {
            ":AccountType": "ADMIN"
        }
    }
);
const items = [];
for await (const page of paginator) {
    items.push(...page.Items);
}
console.log(items);

```

## 追加、更新、削除
### BatchWriteCommand

複数のItemの一括追加/更新/削除用
1回で最大25件まで処理できます。
書き込むすべての項目の合計サイズが 16MBを超えてはいけません。

```JavaScript
await dynamo.send(
    new BatchWriteCommand({
        RequestItems: {
            "tableName": [
                {
                    PutRequest: {
                        Item: {
                            AccountType: "ADMIN",
                            user_id: "4",
                            role_id: "role_admin",
                        },
                    },
                },
                {
                    DeleteRequest: {
                        Key: {
                            AccountType: "ADMIN",
                            user_id: "1",
                        },
                    },
                },
            ],
        },
    })
);
```
### TransactWriteCommand
トランザクションで複数のItemの追加/更新/削除を行う際に使用します。
1回で最大100件まで処理できます。
トランザクションには、4MBを超えるデータを含めることはできません。

```JavaScript
await dynamo.send(
    new TransactWriteCommand({
        TransactItems: [
            {
                Put: {
                    TableName: "tableName",
                    Item: {
                        AccountType: "ADMIN",
                        user_id: "1",
                        role_id: "role_admin",
                    },
                    ConditionExpression: "attribute_not_exists (user_id)",
                },
            },
            {
                Update: {
                    TableName: "tableName",
                    Key: {
                        AccountType: "ADMIN",
                        user_id: "1",
                    },
                    UpdateExpression: "set role_id = :role_id",
                    ExpressionAttributeValues: {
                        ":role_id": "role_admin",
                    },
                },
            },
            {
                Delete: {
                    TableName: "tableName",
                    Key: {
                        AccountType: "Admin",
                        user_id: "3",
                    },
                },
            },
        ],
    })
);
```

## UpdateCommand

上書き。元の値がない場合は追加になるので注意
UpdateExpressionのオプションが色々あるので、試してみると面白いです。
https://dev.classmethod.jp/articles/dynamodb-update-expression-actions/

```JavaScript
await dynamo.send(
    new UpdateCommand({
        TableName: "tableName",
        Key: {
            AccountType: "ADMIN",
            user_id: "1",
        },
        UpdateExpression: "set role_id = :role_id",
        ExpressionAttributeValues: {
            ":role_id": "role_admin_2",
        },
    })
);
```

## PutCommand

指定されたアイテムがテーブルにない場合は追加、ある場合は更新します。
PutCommandは、アイテムの完全な上書きを行うため、使用する前に必ず存在確認を行う必要があります。一方、UpdateCommandは、条件式を使用して更新を制御することができるため、既存のアイテムの一部だけを更新する場合に便利です。
パーティションキーとソートキーが設定されているテーブルの場合パーティションキーは必須項目になります。

```JavaScript
await dynamo.send(
    new PutCommand({
        TableName: "tableName",
        Item: {
            AccountType: "ADMIN",
            user_id: "2",
            role_id: "role_admin",
        }
    })
);
```

## DeleteCommand

削除コマンド。削除時に対象のItemがない場合もエラーにならない。

```JavaScript
await dynamo.send(
    new DeleteCommand({
        TableName: "tableName",
        Key: {
            AccountType: "ADMIN",
            user_id: "1",
        },
        // DynamoDBは削除時に対象のItemがない場合もエラーにならない
        // 対象のItemが存在しない場合エラーを出して欲しい時は下を指定する
        ConditionExpression: "attribute_exists(AccountType) and attribute_exists(user_id)",
    })
);
```
