# セキュリティガイドライン - ScheduleAvailable

## セキュリティ対策一覧

### 1. 実装済みのセキュリティ対策

#### XSS (Cross-Site Scripting) 対策
- Reactの自動エスケープ機能を活用
- `dangerouslySetInnerHTML`の不使用
- ユーザー入力のサニタイゼーション処理実装
- `sanitizer.ts`による入力検証

#### CSP (Content Security Policy)
- 厳格なCSPヘッダーの設定
- インラインスクリプトの制限
- 外部リソースのホワイトリスト化
- `frame-ancestors 'none'`によるクリックジャッキング対策

#### 認証・認可
- Google OAuth 2.0による安全な認証
- クライアントサイドのみの処理（サーバーレス）
- トークンの適切な管理
- セッションタイムアウトの実装

#### データ保護
- HTTPS通信の強制（`upgrade-insecure-requests`）
- ローカルストレージの最小限使用
- 機密情報の非保存ポリシー
- 環境変数による設定管理

#### 依存関係の管理
- `npm audit`による定期的な脆弱性チェック
- 最小限の依存関係
- 信頼できるパッケージのみ使用

### 2. デプロイ前のチェックリスト

```bash
# セキュリティチェックコマンド
npm audit                    # 脆弱性チェック
npm run build               # プロダクションビルド
npm run test               # テスト実行
```

### 3. 環境変数の設定

#### 開発環境 (.env)
```env
VITE_GOOGLE_CLIENT_ID=development_client_id
VITE_APP_ENV=development
```

#### 本番環境 (.env.production)
```env
VITE_GOOGLE_CLIENT_ID=production_client_id
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
```

### 4. HTTPセキュリティヘッダー

本番環境では、以下のヘッダーを設定してください：

```nginx
# Nginx設定例
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### 5. Google Cloud Console設定

#### OAuth 2.0設定
1. 本番環境のURLを承認済みオリジンに追加
2. リダイレクトURIを適切に設定
3. スコープを最小限に制限

```
承認済みのJavaScriptオリジン:
- https://your-domain.com
- https://www.your-domain.com

承認済みのリダイレクトURI:
- https://your-domain.com
- https://www.your-domain.com
```

### 6. セキュリティベストプラクティス

#### データ処理
- クライアントサイドのみでデータ処理
- 個人情報の非保存
- Google APIトークンの適切な管理
- セッション情報の最小限保持

#### 入力検証
- 日付範囲の制限（前後10年）
- 文字列長の制限
- 特殊文字のエスケープ
- URLとメールアドレスの検証

#### エラーハンドリング
- エラーメッセージの適切な抽象化
- スタックトレースの非表示
- ユーザーフレンドリーなエラー表示

### 7. インシデント対応

セキュリティ問題を発見した場合：

1. **報告先**: [セキュリティ連絡先メールアドレス]
2. **対応時間**: 48時間以内に初回対応
3. **修正**: 重要度に応じて24-72時間以内

### 8. 監査ログ

本番環境では以下のログを記録することを推奨：

- 認証試行（成功/失敗）
- APIアクセス頻度
- エラー発生状況
- 異常なアクセスパターン

### 9. レート制限

実装済みのレート制限：
- API呼び出し: 30リクエスト/分
- 認証試行: 5回/10分

### 10. デプロイメントセキュリティ

#### Vercel/Netlifyデプロイ時
```bash
# 環境変数の設定
vercel env add VITE_GOOGLE_CLIENT_ID production
```

#### CloudflareやCDN使用時
- DDoS対策の有効化
- WAF（Web Application Firewall）の設定
- Bot対策の実装

### 11. プライバシーポリシー

本番環境では以下を明記：
- Googleカレンダーデータの使用目的
- データの保存期間（セッション限定）
- 第三者へのデータ提供なし
- ユーザーの権利（データ削除要求等）

### 12. コンプライアンス

- GDPR対応（EU向け）
- CCPA対応（カリフォルニア州向け）
- 日本の個人情報保護法対応

---

## セキュリティ脆弱性の報告

セキュリティ上の問題を発見した場合は、公開のイシューではなく、プライベートに報告してください。

**最終更新**: 2024年10月
**バージョン**: 1.0.0