# 直接OAuth実装のテスト手順

## 🚀 実装内容

Google Sign-In JavaScript SDKの「idpiframe_initialization_failed」エラーを回避するため、OAuth 2.0の暗黙的フロー（Implicit Flow）を直接実装しました。

### 新しいファイル：
- `/src/services/googleAuthDirect.ts` - 直接OAuth実装
- `/src/hooks/useGoogleAuth.ts` - 更新済み（直接OAuth対応）
- `/src/services/googleCalendar.ts` - 更新済み（直接OAuth対応）

##  テスト手順

### 1. アプリケーションを起動
```bash
npm run dev
```

### 2. ブラウザでアクセス
http://localhost:5173

### 3. Googleログインをテスト

1. **「Googleでログイン」ボタンをクリック**
   - Googleの認証画面にリダイレクトされます
   - URLが `https://accounts.google.com/o/oauth2/v2/auth` に変わります

2. **Googleアカウントでログイン**
   - アカウントを選択またはログイン
   - 権限の確認画面が表示されたら「許可」をクリック

3. **アプリにリダイレクト**
   - `http://localhost:5173#access_token=...` にリダイレクトされます
   - アプリが自動的にトークンを検出して認証状態を更新

4. **カレンダー機能をテスト**
   - カレンダータブを開く
   - 予定が表示されることを確認
   - 空き時間検索を実行

## 🔍 デバッグ方法

### ブラウザのコンソールを確認

1. **Chrome DevTools を開く**（F12またはCmd+Option+I）
2. **Console タブを確認**

期待されるログ：
```javascript
// ログイン時
"Sign in button clicked"
// リダイレクト後
"Token found in URL hash"
"Token stored successfully"
```

### エラーが発生した場合

#### "Not a valid origin for the client" エラー
- Google Cloud Console で承認済みオリジンを再確認
- `http://localhost:5173` が正確に登録されているか確認
- 15分以上待ってから再試行

#### トークンが取得できない
- URLハッシュに `#access_token=` が含まれているか確認
- セッションストレージを確認：
  ```javascript
  sessionStorage.getItem('google_access_token')
  ```

##  動作確認項目

###  基本機能
- [ ] Googleログインボタンが表示される
- [ ] クリックするとGoogleの認証画面にリダイレクト
- [ ] 認証後、アプリにリダイレクト
- [ ] ログイン状態が保持される

###  カレンダー機能
- [ ] カレンダーの予定が表示される
- [ ] 新しい予定を作成できる
- [ ] 予定を編集できる
- [ ] 予定を削除できる
- [ ] 空き時間検索が動作する

###  セッション管理
- [ ] ページをリロードしてもログイン状態が維持される
- [ ] ログアウトが正常に動作する
- [ ] トークンの有効期限が管理される

##  代替テスト方法

### 1. 直接OAuth URLをテスト

`test-oauth-direct.html` ファイルをブラウザで開く：
```bash
open /Users/ayumuyoshino/GitHub/ScheduleAvailable/test-oauth-direct.html
```

リンクをクリックして、Googleの認証画面が表示されるか確認。

### 2. 別のブラウザでテスト

Chrome以外のブラウザ（Firefox、Safari）でテスト：
- サードパーティCookieの制限が異なる場合がある
- クリーンな環境でテスト可能

### 3. シークレットウィンドウでテスト

シークレット/プライベートウィンドウを使用：
- キャッシュやCookieの影響を排除
- クリーンな状態でテスト

## 🛠️ トラブルシューティングコマンド

### キャッシュクリア
```javascript
// ブラウザコンソールで実行
sessionStorage.clear();
localStorage.clear();
location.reload();
```

### 手動でトークンを確認
```javascript
// ブラウザコンソールで実行
console.log('Token:', sessionStorage.getItem('google_access_token'));
console.log('Expires:', new Date(parseInt(sessionStorage.getItem('google_token_expires_at'))));
```

### 強制的にデモモードに切り替え
```javascript
// ブラウザコンソールで実行
document.querySelector('[data-testid="demo-mode-toggle"]')?.click();
```

##  実装の違い

### 従来の実装（Google Sign-In SDK）
- Google提供のJavaScript SDKを使用
- `gapi.auth2` ライブラリ
- ポップアップウィンドウで認証
- サードパーティCookieが必要

### 新しい実装（直接OAuth）
- OAuth 2.0の暗黙的フローを直接実装
- リダイレクトベースの認証
- サードパーティCookieが不要
- より互換性が高い

## ✨ メリット

1. **サードパーティCookie不要**
   - Chrome 115以降でも動作
   - プライバシー設定に依存しない

2. **シンプルな実装**
   - 外部SDKへの依存が少ない
   - デバッグが容易

3. **高い互換性**
   - すべてのモダンブラウザで動作
   - モバイルブラウザでも動作

---

**最終更新**: 2024年10月
**実装バージョン**: 2.0.0