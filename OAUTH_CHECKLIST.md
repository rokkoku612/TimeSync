# Google OAuth設定チェックリスト

## 🔍 確認項目

### 1. OAuth同意画面の設定
Google Cloud Console > APIs & Services > OAuth consent screen

#### 必須確認項目：
- [ ] **公開ステータス**: テスト or 本番公開
- [ ] **アプリ名**: ScheduleAvailable
- [ ] **ユーザーサポートメール**: 設定済み
- [ ] **開発者連絡先情報**: 設定済み
- [ ] **承認済みドメイン**: localhost追加（テスト用）

#### スコープ設定：
- [ ] Google Calendar API スコープが追加されているか
  - `https://www.googleapis.com/auth/calendar.readonly`
  - `https://www.googleapis.com/auth/calendar.events`

#### テストユーザー（テストモードの場合）：
- [ ] テストユーザーにあなたのメールアドレスが追加されているか

### 2. 認証情報の設定
Google Cloud Console > APIs & Services > Credentials

#### OAuth 2.0 クライアント ID:
- [ ] **クライアントID**: `265218873363-fup2h73rn4hqpoccubud3afk243umf.apps.googleusercontent.com`
- [ ] **アプリケーションの種類**: ウェブアプリケーション

#### 承認済みのJavaScriptオリジン:
- [ ] `http://localhost:5173`
- [ ] `http://localhost:5174` (予備)
- [ ] `http://127.0.0.1:5173` (予備)

#### 承認済みのリダイレクトURI:
- [ ] `http://localhost:5173`
- [ ] `http://localhost:5174` (予備)

### 3. APIの有効化
Google Cloud Console > APIs & Services > Enabled APIs

- [ ] **Google Calendar API**: 有効
- [ ] **Google Identity and Access Management API**: 有効（OAuth用）

### 4. プロジェクト設定
Google Cloud Console > IAM & Admin > Settings

- [ ] **プロジェクトID**: `schedule-available-1755885477`
- [ ] **プロジェクト名**: ScheduleAvailable

## ⏱️ 待機時間について

### 新規プロジェクトの場合：
- **一般的な待機時間**: 5〜60分
- **最大待機時間**: 1時間以上の場合もあり

### 設定変更後の伝播時間：
- **OAuth同意画面の変更**: 即座〜5分
- **認証情報の変更**: 5〜15分
- **スコープの追加**: 5〜30分
- **テストユーザーの追加**: 即座〜5分

##  トラブルシューティング

### "Not a valid origin for the client" エラーの場合：

1. **キャッシュクリア**:
   - ブラウザのキャッシュとCookieをクリア
   - シークレット/プライベートウィンドウで試す

2. **別のブラウザで試す**:
   - Chrome → Firefox/Safari
   - サードパーティCookieの制限を回避

3. **URLの確認**:
   - `http://` と `https://` を間違えていないか
   - ポート番号が正しいか（5173）
   - 末尾にスラッシュがないか

4. **待機時間を確認**:
   - プロジェクト作成から1時間経過したか
   - 最後の設定変更から15分経過したか

### "idpiframe_initialization_failed" エラーの場合：

1. **サードパーティCookieを有効化**:
   - Chrome設定 > プライバシーとセキュリティ
   - サードパーティCookieを許可

2. **特定サイトの例外設定**:
   - accounts.google.comを例外に追加
   - *.google.comを許可

##  確認履歴

| 日時 | 確認項目 | 結果 | 備考 |
|------|---------|------|------|
| 2024/10/XX 10:00 | プロジェクト作成 |  | schedule-available-1755885477 |
| 2024/10/XX 10:15 | OAuth同意画面設定 |  | テストモード |
| 2024/10/XX 10:20 | クライアントID作成 |  | 265218873363-... |
| 2024/10/XX 10:25 | JavaScript オリジン追加 |  | http://localhost:5173 |
| 2024/10/XX 11:15 | 動作確認 | ❌ | エラー: Not a valid origin |

## 🚀 次のステップ

1. 上記チェックリストをすべて確認
2. 設定変更から15分以上待機
3. test-oauth-direct.htmlで直接テスト
4. 別のブラウザで試す
5. それでも動作しない場合は新しいプロジェクトを作成