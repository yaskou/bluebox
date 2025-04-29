# BlueBox
オープンソースクラウドストレージ

## インストール手順
### 1. node_modulesをインストール
```bash
npm install
```
### 2. [Google Login](https://console.cloud.google.com/)の設定
1. クライアントIDとクライアントシークレットを発行
2. envファイルに記録
```
AUTH_GOOGLE_ID="クライアントID"
AUTH_GOOGLE_SECRET="クライアントシークレット"
AUTH_TRUST_HOST=true
```
3. シークレットキーの生成
```bash
npx auth secret
```
### 3. データベースの設定
1. [postgres](https://www.postgresql.org/download/)をインストール
2. データベースのURLをenvに追記
```
DATABASE_URL="データベースのURL"
```
3. データベースを初期化
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```
### 4. 画像の保存ディレクトリをenvに追記
```
CONTENTS_DIR="画像の保存先"
```
### 5. [ffmpeg](https://ffmpeg.org/download.html)のインストール
