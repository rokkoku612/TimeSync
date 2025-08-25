# Google OAuth設定ガイド

## 必要な設定

Google Cloud Consoleで以下のURLを承認済みリダイレクトURIに追加する必要があります：

### 1. 開発環境
- `http://localhost:5174`
- `http://192.168.1.150:5174`

### 2. 本番環境（GitHub Pages）
- `https://rokkoku612.github.io/TimeSync/` （末尾スラッシュあり）

### 3. Authorized JavaScript origins
- `http://localhost:5174`
- `http://192.168.1.150:5174`
- `https://rokkoku612.github.io`

## 設定手順

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを選択
3. 「APIとサービス」→「認証情報」を開く
4. OAuth 2.0 クライアントIDを選択
5. 以下を設定：

### Authorized JavaScript origins
```
http://localhost:5174
http://192.168.1.150:5174
https://rokkoku612.github.io
```

### Authorized redirect URIs
```
http://localhost:5174
http://192.168.1.150:5174
https://rokkoku612.github.io/TimeSync/
```

## 重要な注意事項

- URLは完全一致する必要があります
- GitHub Pagesの場合、`/TimeSync/`パスを含める必要があります（末尾スラッシュあり）
- 変更後、反映まで5-10分かかることがあります

## トラブルシューティング

### エラー400: invalid_request
- リダイレクトURIが正しく設定されていない
- Google Cloud Consoleで上記のURLをすべて追加してください

### flowName=GeneralOAuthFlow
- OAuth設定の不一致
- Authorized JavaScript originsとAuthorized redirect URIsの両方を確認してください