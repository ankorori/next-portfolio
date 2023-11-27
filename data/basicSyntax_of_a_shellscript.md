---
id: 3
title: "シェルスクリプトの基本構文とかをまとめてみた"
date: "2023-11-21"
image: "/images/linux.png"
excerpt: "シェルスクリプトの基本構文などをまとめました"
---

シェルスクリプトを書く機会があり、色々調べたのでメモとして残します。

## シェルスクリプトとは？

シェルスクリプト（Shell Script）は、コンピュータのオペレーティングシステムのコマンドラインシェル（通常はUnixシェルやLinuxシェル）で実行できるスクリプトプログラムです。シェルスクリプトは、コマンドラインインターフェース（CLI）を使用してオペレーティングシステムに対する一連のコマンドや操作を自動化するために使用されます。

## VScodeの拡張機能

コーディングにあたって便利な拡張機能の紹介です
下記をインストールすると静的コード解析やフォーマット調整など出来ます

- [Bash VS Code Extension Pack](https://marketplace.visualstudio.com/items?itemName=pinage404.bash-extension-pack)

## 基本構文

### シバン シェバング(Shebang)

実行するシェルスクリプトのインタプリタを指定します
pythonを指定したりも出来ます

```bash
# bash
#!/bin/bash

# python
#!/usr/bin/env python3
```

### 変数宣言

変数名＝値で宣言します。間にスペースがあるとエラーになるので注意

```bash
#!/bin/bash

TEXT="HELLO"
echo "$TEXT"
```
```bash
$bash test.sh
HELLO
```

### 配列

変数と同様に変数名＝値で宣言
カッコの中に値を入れます
値は半角スペースで区切って書きます

- [Bashの配列の使い方: 要素の参照、追加、削除。要素数の取得など](https://yu-nix.com/archives/bash-array/)

```bash
#!/bin/bash
ARRAY=(0 1 2 3 4 5)

# 全部の値を展開するとき
echo "${ARRAY[@]}"

# どれか一つの時
echo "${ARRAY[0]}"
```

```bash
$ bash test.sh
0 1 2 3 4 5
0
```

### 連想配列


- [declare使ってBashで配列と連想配列](https://future-architect.github.io/articles/20210401/)

```bash
#!/bin/bash
declare -A items=([item]="Orange" [price]=100)

echo "${items[@]}"
```

```bash
$ bash test.sh
100 Orange
```


### スクリプト実行時に引数を渡す

スクリプト実行時に何か値を渡したい場合は特殊変数を使います
第一引数　＄１
第二引数　＄２ ...
9番目までは上記のような形ですが10番目からは`${10}`のように書かないといけません

```bash
#!/bin/bash

echo "$1"
echo "$2"
```

```bash
$ bash test.sh 1 2
1
2
```

デフォルト値の設定も可能です
`${1:-デフォルト値}`という形で指定します

```bash
#!/bin/bash

echo "${1:-10}"
echo "${2:-100}"
```

```
$ bash test.sh 1
1
100
```

### if文

- [【bash】if else文の使い方【初心者向け】](https://lanchesters.site/bash-if-else/)

```bash
#!/bin/bash

value=1
if [[ "$value" =~ ^[0-9]+$ ]]; then
    echo "OK"
else
    echo "NG"
fi
```

```
$ bash test.sh
OK
```

### ループ

[Bashのfor文の書き方: ループ文で繰り返し処理を行う](https://yu-nix.com/archives/bash-for/)

```bash
#!/bin/bash

FRUITS=("apple" "orange" "banana")

for name in "${FRUITS[@]}"; do
    echo "$name"
done
```

```bash
$ bash test.sh
apple
orange
banana
```

### エラーが起きた時に処理を止める

shellscriptはエラーが起きてもデフォルトではそのまま後続処理が走ってしまいます
ここが自分は一番びっくりでした…

対策は下記のように`set -eu`という宣言を最初にします
この宣言をしておけばエラーがあった際そこで処理が止まります

- [シェルスクリプトを書くときはset -euしておく](https://qiita.com/youcune/items/fcfb4ad3d7c1edf9dc96)

```bash
#!/bin/bash

set -eu

```

### ロギング

実行ログをファイルに出しておきたい時は下記のように書けます

```bash
#!/bin/bash

LOG_OUT=invoke.log
exec > >(tee -a "$LOG_OUT") 2>&1
echo "[$(date +"%Y-%m-%d %H:%M:%S")][INFO]: ############# invoke start #############"
```

### スクリプトの実行パスを取得する

[[bash] 実行スクリプトの絶対パスの取得](https://qiita.com/koara-local/items/2d67c0964188bba39e29)

```bash
#!/bin/bash

CURRENT_PATH=$(cd $(dirname $0); pwd)
```

### 実行前に実行しても良いか確認する

- [BASHシェルスクリプトで「キー入力待ち」プロンプトを実装する](https://dev.classmethod.jp/articles/waiting-for-your-input-with-read-command/)

```bash
#!/bin/bash

echo -n "実行してもいいですか? [yes/no] : "
while read -r confirmation; do
    case $confirmation in
        'yes' )
            echo "実行してます"
            break ;;
        'no' ) echo "実行やめます"
            exit 0 ;;
        *) echo "yes,noで答えてください"
            echo -n "実行しても良いですか？ [yes/no] : " ;;
    esac
done
```

### 一時ファイル作りたい

```bash
temp_file=$(mktemp)
```

### 他のファイルを読み込みたい

- [【shellscript】外部ファイルから変数を取得する](https://qiita.com/aki_number16/items/155d0dff85917b9a829b)

```bash
#!/bin/bash

CURRENT_PATH=$(cd $(dirname $0); pwd)
source $CURRENT_PATH/conf.sh
```
