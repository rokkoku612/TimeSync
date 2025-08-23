# OAuth認証エラーの解決方法

##  エラー内容
「アクセスをブロック: 認証エラーです」
「The OAuth client was not found」
エラー401: invalid_client

##  解決手順

### 1. Google Cloud Consoleで確認

#### ステップ1: プロジェクトの確認
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクト選択で「schedule-available-1755885477」を選択
3. または新しいプロジェクトを作成

#### ステップ2: OAuth同意画面の設定
1. 左メニュー「APIs & Services」→「OAuth consent screen」
2. 以下を設定：
   - **User Type**: External（外部）を選択
   - **App name**: TimeSync
   - **User support email**: あなたのメールアドレス
   - **Developer contact information**: あなたのメールアドレス
3. 「SAVE AND CONTINUE」をクリック

#### ステップ3: スコープの追加
1. 「ADD OR REMOVE SCOPES」をクリック
2. 以下のスコープを追加：
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
3. 「UPDATE」→「SAVE AND CONTINUE」

#### ステップ4: テストユーザーの追加
1. 「ADD USERS」をクリック
2. あなたのGmailアドレスを追加
3. 「ADD」→「SAVE AND CONTINUE」

#### ステップ5: 認証情報の再作成
1. 「Credentials」タブに移動
2. 既存のOAuth 2.0 Client IDを削除
3. 「+ CREATE CREDENTIALS」→「OAuth client ID」
4. 以下を設定：
   - **Application type**: Web application
   - **Name**: TimeSync Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     http://localhost:5174
     http://127.0.0.1:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173
     http://localhost:5174
     http://127.0.0.1:5173
     ```
5. 「CREATE」をクリック

### 2. 新しいClient IDで.envを更新

新しく作成されたClient IDをコピーして、`.env`ファイルを更新：

```env
VITE_GOOGLE_CLIENT_ID=新しいクライアントID
```

### 3. アプリケーションを再起動

```bash
# Ctrl+C で停止してから
npm run dev
```

## 🔍 よくある問題と解決方法

### 問題1: 「テストモード」の制限
**症状**: 「このアプリはテストモードです」と表示される
**解決方法**: 
- OAuth同意画面で自分のメールアドレスをテストユーザーとして追加
- または、本番公開申請を行う（審査が必要）

### 問題2: Client IDが無効
**症状**: 「invalid_client」エラー
**解決方法**:
- Client IDが正しくコピーされているか確認
- 末尾に余分なスペースがないか確認
- プロジェクトが正しいか確認

### 問題3: リダイレクトURIの不一致
**症状**: 「redirect_uri_mismatch」エラー
**解決方法**:
- Google Cloud ConsoleのAuthorized redirect URIsを確認
- `http://localhost:5173`（httpsではない）が登録されているか確認

##  即座に試せる代替方法

### デモモードを使用
1. アプリケーションでデモモードトグルをオン
2. デモデータで機能をテスト

### 別のGoogleアカウントで新規プロジェクト作成
1. 別のGoogleアカウントにログイン
2. 新しいプロジェクトを最初から作成
3. 手順を最初から実行

##  チェックリスト

- [ ] OAuth同意画面が設定済み
- [ ] アプリ名とサポートメールが入力済み
- [ ] 必要なスコープが追加済み
- [ ] テストユーザーに自分のメールアドレスが追加済み
- [ ] Client IDが正しく作成済み
- [ ] Authorized JavaScript originsが設定済み
- [ ] Authorized redirect URIsが設定済み
- [ ] .envファイルが更新済み
- [ ] アプリケーションを再起動済み

## 🚀 期待される動作

1. 「Googleでログイン」をクリック
2. Googleアカウント選択画面が表示
3. 権限確認画面で「許可」をクリック
4. `http://localhost:5173#access_token=...`にリダイレクト
5. アプリが自動的にログイン状態になる

---

**重要**: Google Cloud Consoleの設定変更後、反映まで5〜15分かかる場合があります。