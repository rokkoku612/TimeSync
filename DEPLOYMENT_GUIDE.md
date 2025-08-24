# TimeSync 完全デプロイメントガイド

## 目次

1. [はじめに](#はじめに)
2. [前提条件](#前提条件)
3. [Cloudflare Pages デプロイ手順](#cloudflare-pages-デプロイ手順)
4. [Vercel デプロイ手順](#vercel-デプロイ手順)
5. [Netlify デプロイ手順](#netlify-デプロイ手順)
6. [カスタムドメイン設定](#カスタムドメイン設定)
7. [環境変数の設定](#環境変数の設定)
8. [トラブルシューティング](#トラブルシューティング)
9. [パフォーマンス最適化](#パフォーマンス最適化)
10. [セキュリティ設定](#セキュリティ設定)

---

## はじめに

このガイドでは、TimeSyncアプリケーションを本番環境にデプロイする手順を詳しく説明します。初心者の方でも簡単にデプロイできるよう、画面ごとの詳細な説明を含めています。

### デプロイとは？
デプロイとは、開発したWebアプリケーションをインターネット上で誰でもアクセスできるように公開することです。

### なぜCloudflare Pagesを推奨するか？
- **無料プラン**が充実（月間500ビルドまで無料）
- **高速配信**（世界中のCDNから配信）
- **自動デプロイ**（GitHubと連携して自動更新）
- **SSL証明書**が無料で自動設定
- **簡単な設定**（初心者でも10分でデプロイ可能）

---

## 前提条件

デプロイを始める前に、以下の準備が必要です：

### 1. 必須要件

#### ローカル環境
- [ ] Node.js 18.17.0以上がインストールされている
- [ ] npm 9.6.7以上がインストールされている
- [ ] Gitがインストールされている

#### 確認方法
```bash
# Node.jsのバージョン確認
node --version
# 出力例: v18.17.0

# npmのバージョン確認
npm --version
# 出力例: 9.6.7

# Gitのバージョン確認
git --version
# 出力例: git version 2.39.0
```

### 2. GitHubアカウントの準備

1. [GitHub](https://github.com)にアクセス
2. アカウントを作成（すでにある場合はスキップ）
3. リポジトリにコードをプッシュ

```bash
# GitHubリポジトリの作成と初回プッシュ
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/TimeSync.git
git push -u origin main
```

### 3. Google OAuth認証の設定

#### 3.1 Google Cloud Consoleにアクセス
1. [Google Cloud Console](https://console.cloud.google.com/)を開く
2. Googleアカウントでログイン

#### 3.2 新しいプロジェクトを作成
1. 画面上部のプロジェクト選択メニューをクリック
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を入力（例：`TimeSync-Production`）
4. 「作成」をクリック

#### 3.3 Google Calendar APIを有効化
1. 左側メニューから「APIとサービス」→「ライブラリ」を選択
2. 検索バーに「Google Calendar API」と入力
3. 「Google Calendar API」をクリック
4. 「有効にする」ボタンをクリック

#### 3.4 OAuth 2.0認証情報を作成
1. 左側メニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuth クライアント ID」をクリック
3. 初回の場合は「同意画面を構成」が必要：
   - ユーザータイプ: 「外部」を選択
   - アプリ名: `TimeSync`
   - ユーザーサポートメール: あなたのメールアドレス
   - 開発者の連絡先情報: あなたのメールアドレス
   - 「保存して次へ」をクリック

#### 3.5 OAuth クライアントIDの作成
1. アプリケーションの種類: 「ウェブアプリケーション」を選択
2. 名前: `TimeSync Web Client`
3. 承認済みのJavaScript生成元に以下を追加：
   ```
   http://localhost:5173
   http://localhost:5174
   https://あなたのドメイン.pages.dev
   https://あなたのカスタムドメイン.com
   ```
4. 「作成」をクリック
5. 表示されたクライアントIDをコピーして保存

---

## Cloudflare Pages デプロイ手順

### ステップ1: Cloudflareアカウントの作成

1. [Cloudflare](https://www.cloudflare.com/)にアクセス
2. 「Sign Up」をクリック
3. メールアドレスとパスワードを入力
4. メール認証を完了

### ステップ2: Cloudflare Pagesにアクセス

1. Cloudflareダッシュボードにログイン
2. 左側メニューから「Pages」をクリック
3. 「Create a project」ボタンをクリック

### ステップ3: GitHubとの連携

1. 「Connect to Git」をクリック
2. 「Connect GitHub」を選択
3. GitHubの認証画面が表示されたら「Authorize Cloudflare Pages」をクリック
4. リポジトリへのアクセス権限を設定：
   - 「All repositories」または「Only select repositories」を選択
   - 「Only select repositories」の場合は「TimeSync」を選択
5. 「Install & Authorize」をクリック

### ステップ4: プロジェクトの設定

#### 4.1 リポジトリの選択
1. GitHubリポジトリ一覧から「TimeSync」を選択
2. 「Begin setup」をクリック

#### 4.2 ビルド設定
以下の設定を入力します：

| 設定項目 | 入力値 |
|---------|--------|
| **Project name** | `timesync`（任意の名前） |
| **Production branch** | `main` |
| **Framework preset** | `None`を選択 |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

#### 4.3 環境変数の設定
「Environment variables」セクションで以下を追加：

1. 「Add variable」をクリック
2. 以下の変数を設定：
   - **Variable name**: `VITE_GOOGLE_CLIENT_ID`
   - **Value**: `あなたのGoogleクライアントID`
3. 必要に応じて他の環境変数も追加：
   - `VITE_DEFAULT_LANGUAGE`: `ja`
   - `VITE_DEFAULT_MIN_DURATION`: `30`
   - `VITE_DEFAULT_WEEK_START`: `1`

### ステップ5: デプロイの実行

1. 「Save and Deploy」をクリック
2. デプロイが開始されます（通常2-3分）
3. デプロイ状況をリアルタイムで確認できます

### ステップ6: デプロイの確認

1. デプロイが完了すると、URLが表示されます
   - 例: `https://timesync.pages.dev`
2. URLをクリックしてアプリケーションにアクセス
3. 正常に動作することを確認

### ステップ7: Google OAuth設定の更新

1. Google Cloud Consoleに戻る
2. OAuth 2.0クライアントIDの設定を編集
3. 「承認済みのJavaScript生成元」に新しいURLを追加：
   ```
   https://timesync.pages.dev
   ```
4. 「保存」をクリック

---

## Vercel デプロイ手順

### ステップ1: Vercelアカウントの作成

1. [Vercel](https://vercel.com/)にアクセス
2. 「Sign Up」→「Continue with GitHub」をクリック
3. GitHubアカウントで認証

### ステップ2: プロジェクトのインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. 「Import Git Repository」セクションでTimeSyncリポジトリを選択
3. 「Import」をクリック

### ステップ3: プロジェクト設定

#### ビルド設定
| 設定項目 | 入力値 |
|---------|--------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

#### 環境変数
1. 「Environment Variables」セクションを開く
2. 以下を追加：
   - `VITE_GOOGLE_CLIENT_ID`: あなたのGoogleクライアントID

### ステップ4: デプロイ

1. 「Deploy」をクリック
2. デプロイ完了後、提供されたURLでアクセス確認

---

## Netlify デプロイ手順

### ステップ1: Netlifyアカウントの作成

1. [Netlify](https://www.netlify.com/)にアクセス
2. 「Sign up」→「GitHub」を選択
3. GitHubアカウントで認証

### ステップ2: サイトの作成

1. 「Add new site」→「Import an existing project」をクリック
2. 「Connect to Git provider」でGitHubを選択
3. TimeSyncリポジトリを選択

### ステップ3: ビルド設定

| 設定項目 | 入力値 |
|---------|--------|
| **Base directory** | 空欄 |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

### ステップ4: 環境変数の設定

1. 「Show advanced」をクリック
2. 「New variable」で環境変数を追加
3. `VITE_GOOGLE_CLIENT_ID`を設定

### ステップ5: デプロイ

1. 「Deploy site」をクリック
2. デプロイ完了を待つ（約2-3分）

---

## カスタムドメイン設定

### Cloudflare Pagesでのカスタムドメイン設定

#### ステップ1: ドメインの追加
1. Cloudflare Pagesプロジェクトページを開く
2. 「Custom domains」タブをクリック
3. 「Set up a custom domain」をクリック
4. ドメイン名を入力（例：`timesync.example.com`）

#### ステップ2: DNS設定
##### Cloudflareで管理しているドメインの場合：
1. 自動的にDNSレコードが追加されます
2. 「Activate domain」をクリック

##### 外部DNSプロバイダーの場合：
1. DNSプロバイダーの管理画面にログイン
2. 以下のCNAMEレコードを追加：
   ```
   タイプ: CNAME
   名前: timesync（またはサブドメイン名）
   値: timesync.pages.dev
   ```
3. DNSの伝播を待つ（最大48時間、通常は数分）

#### ステップ3: SSL証明書の確認
1. Cloudflareが自動的にSSL証明書を発行
2. 「SSL/TLS」タブで状態を確認
3. 「Full (strict)」モードが推奨

---

## 環境変数の設定

### 環境変数の種類と用途

| 変数名 | 説明 | 例 | 必須 |
|--------|------|-----|------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth クライアントID | `123456789.apps.googleusercontent.com` | ✅ |
| `VITE_DEFAULT_LANGUAGE` | デフォルト言語 | `ja` または `en` | ❌ |
| `VITE_DEFAULT_MIN_DURATION` | デフォルト最小時間（分） | `30` | ❌ |
| `VITE_DEFAULT_WEEK_START` | 週の開始日（0=日曜、1=月曜） | `1` | ❌ |

### 環境変数の設定方法

#### ローカル開発環境
`.env`ファイルをプロジェクトルートに作成：
```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_DEFAULT_LANGUAGE=ja
VITE_DEFAULT_MIN_DURATION=30
VITE_DEFAULT_WEEK_START=1
```

#### Cloudflare Pages
1. プロジェクト設定→「Environment variables」
2. 「Add variable」で追加
3. 「Save」で保存
4. 再デプロイが必要

#### Vercel
1. プロジェクト設定→「Environment Variables」
2. 変数を追加
3. 「Save」で自動再デプロイ

#### Netlify
1. Site settings→「Environment variables」
2. 「Add a variable」で追加
3. 「Save」で保存
4. 手動で再デプロイ

---

## トラブルシューティング

### よくある問題と解決方法

#### 問題1: ビルドエラー「Module not found」
**原因**: 依存関係が正しくインストールされていない

**解決方法**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 問題2: 「Google認証が機能しない」
**原因**: OAuth設定が不完全

**チェックリスト**:
1. Google Cloud ConsoleでクライアントIDが正しく設定されているか
2. 承認済みJavaScript生成元にデプロイURLが追加されているか
3. 環境変数`VITE_GOOGLE_CLIENT_ID`が正しく設定されているか
4. HTTPSでアクセスしているか（HTTPでは動作しない）

**解決方法**:
1. Google Cloud Consoleで承認済みURLを再確認
2. 環境変数を再設定して再デプロイ
3. ブラウザのキャッシュをクリア

#### 問題3: 「ページが404エラー」
**原因**: SPAのルーティング設定が不適切

**解決方法**:

Cloudflare Pages の場合、`_redirects`ファイルを作成：
```
/* /index.html 200
```

Vercel の場合、`vercel.json`を作成：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Netlify の場合、`netlify.toml`を作成：
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 問題4: 「ビルドタイムアウト」
**原因**: ビルド時間が制限を超えている

**解決方法**:
1. 不要な依存関係を削除
2. ビルドキャッシュをクリア
3. プラットフォームのビルド設定でタイムアウト時間を延長

#### 問題5: 「環境変数が反映されない」
**原因**: Viteの環境変数は`VITE_`プレフィックスが必要

**解決方法**:
1. すべての環境変数が`VITE_`で始まることを確認
2. 環境変数設定後に再デプロイ
3. ビルドログで環境変数が読み込まれているか確認

### デバッグ方法

#### ビルドログの確認
1. デプロイプラットフォームのダッシュボードにアクセス
2. 「Deployments」または「Build logs」を確認
3. エラーメッセージを探す

#### ブラウザコンソールの確認
1. F12キーで開発者ツールを開く
2. Consoleタブでエラーを確認
3. Networkタブで失敗したリクエストを確認

#### ローカルでの再現テスト
```bash
# プロダクションビルドをローカルでテスト
npm run build
npm run preview
# http://localhost:4173 でアクセス
```

---

## パフォーマンス最適化

### 1. ビルド最適化

#### Vite設定の最適化
`vite.config.ts`を編集：
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // チャンクサイズの警告閾値を上げる
    chunkSizeWarningLimit: 1000,
    
    // 圧縮設定
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 本番環境でconsole.logを削除
        drop_debugger: true
      }
    },
    
    // チャンク分割の最適化
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react']
        }
      }
    }
  }
})
```

### 2. 画像最適化

#### 画像の遅延読み込み
```jsx
// 画像コンポーネントに遅延読み込みを追加
<img 
  src={imageSrc} 
  alt={altText}
  loading="lazy"
/>
```

### 3. キャッシュ設定

#### Cloudflare Pagesのキャッシュ設定
`_headers`ファイルを作成：
```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache
```

### 4. CDN設定

#### Cloudflareの最適化設定
1. Cloudflareダッシュボード→「Speed」タブ
2. 以下を有効化：
   - Auto Minify (JavaScript, CSS, HTML)
   - Brotli圧縮
   - Early Hints
   - Rocket Loader

### 5. バンドルサイズの分析

```bash
# バンドルサイズを分析
npm run build -- --report

# または rollup-plugin-visualizer を使用
npm install -D rollup-plugin-visualizer
```

---

## セキュリティ設定

### 1. HTTPS強制

#### Cloudflare Pages
自動的にHTTPSが有効化されます。追加設定：
1. SSL/TLS→「Edge Certificates」
2. 「Always Use HTTPS」を有効化
3. 「Automatic HTTPS Rewrites」を有効化

### 2. セキュリティヘッダー

#### Content Security Policy (CSP)
`_headers`ファイルに追加：
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://www.googleapis.com https://accounts.google.com
```

### 3. 環境変数の保護

#### センシティブな情報の管理
- クライアントIDは公開されても問題ないが、シークレットは絶対に公開しない
- 環境変数はビルド時にのみ使用
- ランタイムシークレットは使用しない

### 4. CORS設定

#### APIエンドポイントの保護
Google Calendar APIはGoogle側でCORS設定されているため、追加設定不要。

### 5. Rate Limiting

#### Cloudflareのレート制限
1. Security→「WAF」→「Rate limiting rules」
2. 新しいルールを作成：
   - Path: `/*`
   - Requests: 100
   - Period: 1分
   - Action: Challenge

---

## デプロイ後のチェックリスト

### 機能テスト
- [ ] トップページが正しく表示される
- [ ] Google認証が機能する
- [ ] カレンダーが表示される
- [ ] 空き時間検索が機能する
- [ ] 言語切り替えが機能する
- [ ] レスポンシブデザインが機能する

### パフォーマンステスト
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)でスコア確認
- [ ] 初回ロード時間が3秒以内
- [ ] Time to Interactive (TTI)が5秒以内

### セキュリティテスト
- [ ] HTTPSでアクセスできる
- [ ] HTTPからHTTPSへリダイレクトされる
- [ ] セキュリティヘッダーが設定されている
- [ ] コンソールにエラーが出ていない

### SEO確認
- [ ] メタタグが正しく設定されている
- [ ] OGP画像が表示される
- [ ] robots.txtが適切

---

## 継続的デプロイメント（CI/CD）

### GitHub Actionsの設定

`.github/workflows/deploy.yml`を作成：
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: echo "Deploy triggered automatically by Cloudflare Pages"
```

### 自動デプロイの流れ
1. コードをGitHubにプッシュ
2. GitHub Actionsでテスト実行
3. Cloudflare Pagesが自動的にビルド・デプロイ
4. 本番環境に反映（約2-3分）

---

## 監視とアラート

### 1. Cloudflare Analytics
- ページビュー、ユニークビジター
- パフォーマンスメトリクス
- エラー率の監視

### 2. Google Analytics 4の設定
```html
<!-- index.htmlに追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. エラー監視（Sentry）
```bash
npm install @sentry/react
```

```typescript
// main.tsxに追加
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

## サポートとリソース

### 公式ドキュメント
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Google Calendar API](https://developers.google.com/calendar)

### コミュニティサポート
- [Cloudflare Community](https://community.cloudflare.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cloudflare-pages)
- [GitHub Issues](https://github.com/yourusername/TimeSync/issues)

### よくある質問（FAQ）

**Q: デプロイにはお金がかかりますか？**
A: Cloudflare Pages、Vercel、Netlifyすべて無料プランがあります。個人利用なら無料で十分です。

**Q: カスタムドメインは必要ですか？**
A: 必須ではありません。`.pages.dev`などの無料サブドメインでも問題なく動作します。

**Q: 複数の環境（開発/本番）を管理できますか？**
A: はい。ブランチごとに異なる環境を設定できます（例：`dev`ブランチ→開発環境）。

**Q: デプロイが失敗した場合はどうすればいいですか？**
A: ビルドログを確認し、エラーメッセージに従って修正してください。多くの場合、依存関係や環境変数の問題です。

---

## まとめ

このガイドに従えば、TimeSyncアプリケーションを確実に本番環境にデプロイできます。問題が発生した場合は、トラブルシューティングセクションを参照するか、GitHubのIssuesで質問してください。

デプロイ成功後は、定期的にアップデートを行い、セキュリティパッチを適用することを忘れないでください。

Happy Deploying! 🚀