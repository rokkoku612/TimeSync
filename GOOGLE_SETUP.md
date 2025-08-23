# Google Calendar 連携セットアップガイド

## 1. Google Cloud Console でのプロジェクト設定

### Step 1: Google Cloud Console にアクセス
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. Google アカウントでログイン

### Step 2: プロジェクトの作成
1. 上部のプロジェクトセレクターをクリック
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を入力（例：`ScheduleAvailable`）
4. 「作成」をクリック

### Step 3: Google Calendar API の有効化
1. 左側メニューから「API とサービス」→「ライブラリ」を選択
2. 検索バーで「Google Calendar API」を検索
3. 「Google Calendar API」をクリック
4. 「有効にする」ボタンをクリック

### Step 4: OAuth 2.0 認証情報の作成
1. 左側メニューから「API とサービス」→「認証情報」を選択
2. 「+ 認証情報を作成」→「OAuth クライアント ID」を選択
3. 初回の場合、OAuth 同意画面の設定が必要：
   - ユーザータイプ：「外部」を選択
   - アプリ名：`ScheduleAvailable`
   - ユーザーサポートメール：あなたのメールアドレス
   - デベロッパーの連絡先情報：あなたのメールアドレス
   - スコープ：以下を追加
     - `../auth/calendar.readonly`
     - `../auth/calendar.events.readonly`

### Step 5: OAuth クライアント ID の作成
1. アプリケーションの種類：「ウェブ アプリケーション」を選択
2. 名前：`ScheduleAvailable Web Client`
3. 承認済みの JavaScript 生成元：
   ```
   http://localhost:5173
   http://localhost:3000
   ```
   本番環境の場合は、実際のドメインも追加：
   ```
   https://yourdomain.com
   ```
4. 承認済みのリダイレクト URI：
   ```
   http://localhost:5173
   http://localhost:3000
   ```
5. 「作成」をクリック
6. 表示されたクライアント ID をコピー

## 2. アプリケーションの設定

### Step 1: 環境変数の設定
1. プロジェクトルートに `.env` ファイルを作成
2. 以下の内容を追加：
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
3. `your-client-id-here` を実際のクライアント ID に置き換え

### Step 2: 依存関係のインストール
```bash
npm install
```

### Step 3: アプリケーションの起動
```bash
npm run dev
```

## 3. 使用方法

### 初回ログイン
1. アプリケーションにアクセス
2. 「Googleでログイン」ボタンをクリック
3. Google アカウントを選択
4. アクセス許可を確認して「許可」をクリック

### カレンダー連携の確認
1. ログイン後、あなたの Google アカウント情報が表示されます
2. 日時を選択して「空き時間を検索」をクリック
3. Google カレンダーの予定を考慮した空き時間が表示されます

## トラブルシューティング

### エラー: "redirect_uri_mismatch"
- Google Cloud Console で設定したリダイレクト URI と実際のアプリケーション URL が一致していることを確認
- ローカル開発の場合は `http://localhost:5173` が設定されているか確認

### エラー: "invalid_client"
- クライアント ID が正しく `.env` ファイルに設定されているか確認
- `.env` ファイルの変更後はアプリケーションを再起動

### エラー: "access_denied"
- Google アカウントでカレンダーへのアクセス許可を与えているか確認
- OAuth 同意画面でスコープが正しく設定されているか確認

## セキュリティに関する注意事項

1. **クライアント ID の管理**
   - `.env` ファイルは `.gitignore` に追加してバージョン管理から除外
   - 本番環境では環境変数として安全に管理

2. **スコープの最小化**
   - 必要最小限のスコープのみを要求
   - 現在は読み取り専用のスコープのみ使用

3. **HTTPS の使用**
   - 本番環境では必ず HTTPS を使用
   - HTTP は開発環境のみで使用

## 本番環境へのデプロイ

1. Google Cloud Console で本番環境の URL を承認済みの JavaScript 生成元とリダイレクト URI に追加
2. 環境変数を本番環境に設定
3. HTTPS が有効になっていることを確認
4. OAuth 同意画面を「本番」に変更（必要に応じて Google の審査を受ける）

---

## 参考リンク

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)