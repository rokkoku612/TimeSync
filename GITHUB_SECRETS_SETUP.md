# GitHub Secrets設定ガイド

## 重要：Google OAuth Client IDの設定

GitHub Pagesで認証を動作させるために、GitHub SecretsにGoogle Client IDを設定する必要があります。

## 設定手順

1. GitHubリポジトリの **Settings** タブを開く
2. 左側メニューの **Secrets and variables** → **Actions** をクリック
3. **New repository secret** ボタンをクリック
4. 以下を設定：
   - **Name**: `VITE_GOOGLE_CLIENT_ID`
   - **Secret**: `228481405429-krab31cq11382774i87dhuccs0j0p9bh.apps.googleusercontent.com`
5. **Add secret** をクリック

## 確認方法

1. Secretが追加されると、リストに表示されます
2. 次回のデプロイから自動的に使用されます
3. mainブランチにプッシュすると自動的にビルド・デプロイが実行されます

## トラブルシューティング

### Client IDが設定されない場合
- Secretの名前が正確に `VITE_GOOGLE_CLIENT_ID` であることを確認
- ワークフローの再実行を試みる（Actions → 最新のワークフロー → Re-run all jobs）

### 認証エラーが続く場合
- Google Cloud ConsoleでOAuth設定を確認
- Authorized JavaScript originsとAuthorized redirect URIsが正しく設定されているか確認