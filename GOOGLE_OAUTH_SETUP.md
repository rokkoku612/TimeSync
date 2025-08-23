# Google OAuth 認証設定ガイド

## ⚠️ 重要な前提条件
Google認証を使用するには、Google Cloud Consoleでの設定が**必須**です。
以下の手順を順番に実行してください。

##  設定手順

### ステップ1: Google Cloud Consoleでの設定（必須）

1. **Google Cloud Consoleにアクセス**
   - URL: https://console.cloud.google.com/
   - Googleアカウントでログイン

2. **プロジェクトの作成**
   - 「プロジェクトを選択」→「新しいプロジェクト」
   - プロジェクト名: `ScheduleAvailable` (任意の名前でOK)
   - 「作成」をクリック

3. **Google Calendar APIの有効化**
   - 左側メニューから「APIとサービス」→「ライブラリ」
   - 検索バーで「Google Calendar API」を検索
   - 「Google Calendar API」をクリック
   - 「有効にする」ボタンをクリック

4. **OAuth 2.0認証情報の作成**
   - 左側メニューから「APIとサービス」→「認証情報」
   - 「+ 認証情報を作成」→「OAuth クライアント ID」
   - 同意画面の設定が求められた場合:
     - ユーザータイプ: 「外部」を選択
     - アプリ名: `ScheduleAvailable`
     - サポートメール: あなたのメールアドレス
     - 開発者の連絡先: あなたのメールアドレス
     - 「保存して次へ」

5. **OAuthクライアントIDの作成**
   - アプリケーションの種類: 「ウェブ アプリケーション」
   - 名前: `ScheduleAvailable Local` (任意)
   
   **承認済みのJavaScriptオリジン**に以下を追加:
   ```
   http://localhost:5173
   ```
   
   **承認済みのリダイレクトURI**に以下を追加:
   ```
   http://localhost:5173
   ```
   
   - 「作成」をクリック

6. **クライアントIDをコピー**
   - 作成されたOAuthクライアントIDが表示されます
   - `xxxxxxxxxxxxx.apps.googleusercontent.com` 形式のIDをコピー

### ステップ2: ローカル環境の設定

1. **`.env`ファイルの編集**
   ```bash
   # .envファイルはすでに作成済みです
   # エディタで開いて編集してください
   ```

2. **クライアントIDを設定**
   `.env`ファイルの最後の行を編集:
   ```
   VITE_GOOGLE_CLIENT_ID=ここにコピーしたクライアントID.apps.googleusercontent.com
   ```
   
   例:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   ```

3. **開発サーバーの再起動**
   ```bash
   # 現在のサーバーを停止 (Ctrl+C)
   # 再起動
   npm run dev
   ```

##  動作確認

1. ブラウザで http://localhost:5173 にアクセス
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントの選択画面が表示されれば成功！

##  トラブルシューティング

### エラー: "Error 400: redirect_uri_mismatch"
- Google Cloud Consoleで設定したリダイレクトURIが正しいか確認
- `http://localhost:5173` (ポート番号も含む)が正確に登録されているか確認

### エラー: "Google is not defined"
- `.env`ファイルのクライアントIDが正しく設定されているか確認
- 開発サーバーを再起動したか確認

### エラー: "Access blocked: This app's request is invalid"
- OAuth同意画面の設定が完了しているか確認
- テストユーザーとして自分のメールアドレスを追加（開発中の場合）

##  本番環境へのデプロイ時の注意

本番環境にデプロイする際は、以下の設定も必要です:

1. Google Cloud Consoleで本番環境のURLを追加
   - 承認済みのJavaScriptオリジン: `https://yourdomain.com`
   - 承認済みのリダイレクトURI: `https://yourdomain.com`

2. 本番環境の環境変数に`VITE_GOOGLE_CLIENT_ID`を設定

## 🔒 セキュリティに関する注意

- `.env`ファイルは**絶対にGitにコミットしない**でください
- `.gitignore`に`.env`が含まれていることを確認してください
- クライアントIDは公開されても問題ありませんが、クライアントシークレットは絶対に公開しないでください

## 🆘 サポート

設定で問題が発生した場合は、以下を確認してください:
- Google Cloud Consoleのエラーメッセージ
- ブラウザのコンソールログ
- 開発サーバーのターミナル出力

---

最終更新: 2024年10月