# TimeSync Cloudflare Pages 完全運用ガイド

## 目次
1. [はじめに - なぜCloudflare Pages？](#はじめに)
2. [事前準備チェックリスト](#事前準備チェックリスト)
3. [ステップ1: ドメイン取得](#ステップ1-ドメイン取得)
4. [ステップ2: Cloudflareアカウント作成](#ステップ2-cloudflareアカウント作成)
5. [ステップ3: プロジェクトデプロイ](#ステップ3-プロジェクトデプロイ)
6. [ステップ4: カスタムドメイン設定](#ステップ4-カスタムドメイン設定)
7. [ステップ5: Google認証設定](#ステップ5-google認証設定)
8. [ステップ6: GTM/GA4導入](#ステップ6-gtmga4導入)
9. [ステップ7: セキュリティ設定](#ステップ7-セキュリティ設定)
10. [ステップ8: 監視とアラート](#ステップ8-監視とアラート)
11. [運用・保守](#運用保守)
12. [トラブルシューティング](#トラブルシューティング)

---

## はじめに

### なぜCloudflare Pages？

#### 完全無料の理由
- **帯域制限なし**: 月間100万アクセスでも0円
- **ビルド時間**: 月500分まで無料（十分）
- **同時ビルド**: 1つ（個人なら問題なし）
- **カスタムドメイン**: 無料で設定可能
- **SSL証明書**: 自動・永久無料

#### 世界最速の理由
- **275都市にCDN**: 日本は東京・大阪にサーバー
- **Anycast**: 最寄りサーバーが自動応答
- **HTTP/3対応**: 最新プロトコル標準対応
- **Brotli圧縮**: gzipより20%高圧縮

#### 最強セキュリティの理由
- **DDoS保護**: 無料で無制限
- **WAF**: 基本的な攻撃を自動ブロック
- **Bot対策**: 悪意のあるBotを自動検出
- **SSL/TLS**: 最新暗号化標準

---

## 事前準備チェックリスト

### 必要なもの
- [ ] GitHubアカウント（無料）
- [ ] メールアドレス
- [ ] クレジットカード（ドメイン購入用、約1,500円/年）
- [ ] Google Cloud Consoleアクセス権
- [ ] 30分の作業時間

### 推奨環境
- [ ] Chrome/Firefox最新版
- [ ] Node.js 18以上インストール済み
- [ ] Git設定済み
- [ ] VS Codeなどのエディタ

---

## ステップ1: ドメイン取得

### なぜ独自ドメインが必要？
- プロフェッショナルな印象
- SEO対策に有利
- ブランディング効果
- 将来の移行が容易

### ドメイン取得先比較

#### 1. Cloudflare Registrar（最推奨）
**料金例（.com）**: 約$9.15/年（約1,400円）

**メリット**:
- 業界最安値（卸値提供）
- 自動でCloudflare DNS
- WHOIS情報保護無料
- 更新料金値上げなし

**取得手順**:
1. Cloudflareログイン → Domain Registration
2. ドメイン検索（例: timesync.com）
3. カートに追加 → 購入
4. 自動でDNS設定完了

#### 2. Google Domains
**料金例（.com）**: 約1,400円/年

**メリット**:
- Googleアカウントで管理
- 日本語サポート
- 分かりやすいUI

**取得手順**:
1. [domains.google.com](https://domains.google.com)アクセス
2. ドメイン検索 → 購入
3. DNS設定でCloudflareのネームサーバーを設定

#### 3. お名前.com
**料金例（.com）**: 初年度1円〜、更新1,400円/年

**注意点**:
- 更新料金に注意
- オプション自動追加に注意
- WHOIS代行設定忘れずに

### ドメイン名の選び方

#### 良いドメイン名の条件
- **短い**: 15文字以内が理想
- **覚えやすい**: スペルが簡単
- **関連性**: サービス内容が分かる
- **.com優先**: 信頼性が高い

#### 避けるべきドメイン
- ハイフン多用（seo-best-practice.com ❌）
- 数字の羅列（site12345.com ❌）
- 商標侵害の可能性があるもの

---

## ステップ2: Cloudflareアカウント作成

### アカウント作成手順

1. **Cloudflareにアクセス**
   ```
   https://dash.cloudflare.com/sign-up
   ```

2. **メールアドレスとパスワード設定**
   - パスワード: 8文字以上、大小英数字混在推奨
   - 2要素認証を後で必ず設定

3. **プラン選択**
   - 「Free」プランを選択（$0/月）
   - クレジットカード不要

4. **メール認証**
   - 認証メールのリンクをクリック
   - ダッシュボードにアクセス可能に

### 2要素認証設定（必須）

1. **My Profile → Authentication**
2. **Two-Factor Authentication → Enable**
3. **認証アプリ選択**:
   - Google Authenticator（推奨）
   - Authy
   - 1Password

4. **QRコード読み取り → 確認コード入力**
5. **リカバリーコード保存**（重要！）

---

## ステップ3: プロジェクトデプロイ

### 方法A: GitHub連携（推奨）

#### 1. Pages作成
```
Cloudflare Dashboard → Pages → Create a project
```

#### 2. Git接続
- 「Connect to Git」選択
- GitHubアカウント連携
- TimeSyncリポジトリ選択
- 「Begin setup」クリック

#### 3. ビルド設定

| 項目 | 設定値 |
|------|--------|
| Project name | timesync |
| Production branch | main |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Environment variables | 下記参照 |

#### 4. 環境変数設定
```
変数名: VITE_GOOGLE_CLIENT_ID
値: your-google-client-id-here.apps.googleusercontent.com
```

追加で設定（後述のGTM用）:
```
変数名: VITE_GTM_ID
値: GTM-XXXXXXX（後で取得）
```

#### 5. デプロイ実行
- 「Save and Deploy」クリック
- 初回: 2-3分
- 完了後URL: `https://timesync.pages.dev`

### 方法B: 直接アップロード

#### 1. ローカルビルド
```bash
cd /Users/ayumuyoshino/GitHub/TimeSync
npm run build
```

#### 2. Cloudflare Dashboardでアップロード
- Pages → Create a project
- 「Upload assets」選択
- distフォルダをドラッグ&ドロップ
- プロジェクト名設定 → デプロイ

### デプロイ確認方法

1. **ビルドログ確認**
   - Pages → プロジェクト → View build
   - エラーがないか確認

2. **サイト動作確認**
   - `https://timesync.pages.dev`にアクセス
   - 基本機能の動作テスト

---

## ステップ4: カスタムドメイン設定

### Cloudflareで購入したドメインの場合

1. **Pages → プロジェクト → Custom domains**
2. **「Add custom domain」クリック**
3. **ドメイン入力**（例: timesync.com）
4. **自動でDNSレコード作成**
5. **5分程度で有効化**

### 他社で購入したドメインの場合

#### 1. Cloudflareにドメイン追加
```
Dashboard → Add a Site → ドメイン入力
```

#### 2. ネームサーバー変更
Cloudflareが表示するネームサーバーをドメイン登録業者で設定:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

#### 3. DNS設定（自動追加されない場合）
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | @ | timesync.pages.dev | ✅ |
| CNAME | www | timesync.pages.dev | ✅ |

#### 4. SSL/TLS設定
- SSL/TLS → Overview → Full (strict)
- Edge Certificates → Always Use HTTPS: ON

### ドメイン反映確認

```bash
# DNSレコード確認
nslookup timesync.com

# HTTPS接続確認
curl -I https://timesync.com
```

---

## ステップ5: Google認証設定

### Google Cloud Console設定

1. **[Google Cloud Console](https://console.cloud.google.com)アクセス**

2. **プロジェクト作成**（未作成の場合）
   - 「プロジェクトを作成」
   - プロジェクト名: TimeSync
   - 組織: なし（個人の場合）

3. **OAuth同意画面設定**
   - APIとサービス → OAuth同意画面
   - User Type: External
   - アプリ名: TimeSync
   - サポートメール: あなたのメール
   - 承認済みドメイン: timesync.com

4. **認証情報作成**
   - APIとサービス → 認証情報 → 作成
   - OAuth クライアント ID
   - アプリケーションの種類: ウェブアプリケーション

5. **承認済みURL設定**

**JavaScript生成元**:
```
https://timesync.com
https://www.timesync.com
https://timesync.pages.dev
http://localhost:5173（開発用）
http://localhost:5174（開発用）
```

**リダイレクトURI**:
```
https://timesync.com
https://www.timesync.com
https://timesync.pages.dev
```

6. **クライアントID取得**
   - 作成後に表示されるクライアントIDをコピー
   - Cloudflare Pages環境変数に設定

### Calendar API有効化

1. **APIライブラリ → 「Google Calendar API」検索**
2. **「有効にする」クリック**
3. **割り当て確認**（無料枠: 1,000,000リクエスト/日）

---

## ステップ6: GTM/GA4導入

### なぜ必要？
- **ユーザー行動分析**: どこでつまずいているか
- **コンバージョン測定**: 目標達成率
- **エラー検知**: JavaScriptエラーを自動収集
- **パフォーマンス測定**: ページ速度監視

### Google Tag Manager設定

#### 1. GTMアカウント作成
1. [tagmanager.google.com](https://tagmanager.google.com)アクセス
2. 「アカウントを作成」
3. アカウント名: TimeSync
4. コンテナ名: timesync.com
5. プラットフォーム: ウェブ

#### 2. GTMコンテナID取得
```
GTM-XXXXXXX（この形式のIDが表示される）
```

#### 3. TimeSyncに実装

**src/index.html編集**:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
  <!-- End Google Tag Manager -->
  
  <title>TimeSync - 日程調整を簡単に</title>
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### Google Analytics 4設定

#### 1. GA4プロパティ作成
1. [analytics.google.com](https://analytics.google.com)アクセス
2. 管理 → プロパティを作成
3. プロパティ名: TimeSync
4. タイムゾーン: 日本
5. 通貨: 日本円

#### 2. 測定ID取得
```
G-XXXXXXXXXX（この形式）
```

#### 3. GTMでGA4タグ設定

**GTMダッシュボード**:
1. タグ → 新規
2. タグの設定 → Googleアナリティクス: GA4設定
3. 測定ID: G-XXXXXXXXXX
4. トリガー: All Pages
5. 保存 → 公開

### 推奨イベント設定

#### ユーザー行動トラッキング

**GTMで設定するイベント**:

1. **カレンダー認証**
```javascript
// タグ名: GA4 - Calendar Auth
// トリガー: カスタムイベント「calendar_auth」
dataLayer.push({
  'event': 'calendar_auth',
  'auth_status': 'success' // or 'failed'
});
```

2. **空き時間検索**
```javascript
// タグ名: GA4 - Search Available Time
// トリガー: カスタムイベント「search_time」
dataLayer.push({
  'event': 'search_time',
  'date_range': '7days', // 検索期間
  'results_count': 10 // 結果数
});
```

3. **テンプレートコピー**
```javascript
// タグ名: GA4 - Copy Template
// トリガー: カスタムイベント「copy_template」
dataLayer.push({
  'event': 'copy_template',
  'template_type': 'standard' // or 'custom'
});
```

#### コンバージョン設定

GA4管理画面:
1. イベント → 「copy_template」をコンバージョンとしてマーク
2. 目標値: 1回のコピー = 成功

### Cookie同意バナー実装

**GDPR/CCPA対応**:

```javascript
// src/components/CookieBanner.tsx
import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    // GTMに同意シグナル送信
    window.dataLayer?.push({
      'event': 'cookie_consent',
      'consent_status': 'accepted'
    });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p>このサイトはCookieを使用してサービスを改善します。</p>
        <button onClick={handleAccept} className="bg-blue-500 text-white px-4 py-2 rounded">
          同意する
        </button>
      </div>
    </div>
  );
};
```

---

## ステップ7: セキュリティ設定

### Cloudflare セキュリティ設定

#### 1. SSL/TLS設定
```
SSL/TLS → Overview
- 暗号化モード: Full (strict)

Edge Certificates
- Always Use HTTPS: ON
- Minimum TLS Version: TLS 1.2
- Automatic HTTPS Rewrites: ON
```

#### 2. セキュリティヘッダー設定

**Pages → プロジェクト → Settings → Functions**

`_headers`ファイル作成:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://www.googleapis.com
```

#### 3. WAF設定
```
Security → WAF
- Managed Rules: ON
- Cloudflare Managed Ruleset: High sensitivity
- OWASP ModSecurity: Anomaly Score 40
```

#### 4. Bot対策
```
Security → Bots
- Bot Fight Mode: ON
- Challenge Passage: 30分
- JavaScript Detection: ON
```

#### 5. Rate Limiting（オプション、有料）
```
Security → Rate Limiting
- Path: /api/*
- Requests: 100 per minute
- Action: Challenge
```

### アプリケーションセキュリティ

#### 環境変数の保護
```javascript
// 絶対にやってはいけない
const apiKey = "sk-xxxxx"; // ❌

// 正しい方法
const apiKey = import.meta.env.VITE_API_KEY; // ✅
```

#### XSS対策
```javascript
// Reactは自動的にエスケープするが、dangerouslySetInnerHTMLは注意
// DOMPurifyでサニタイズ
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
```

---

## ステップ8: 監視とアラート

### Cloudflare Analytics

#### Web Analytics設定
1. **Analytics → Web Analytics**
2. **「Add a site」→ ドメイン入力**
3. **JSスニペット取得**（GTM経由で設置推奨）

**取得できるデータ**:
- ページビュー
- ユニークビジター
- 参照元
- デバイス/ブラウザ
- 国別アクセス
- Core Web Vitals

#### リアルタイムログ（有料）
```
Analytics → Logs → Real-time Logs
- フィルター設定可能
- デバッグに便利
```

### エラー監視（Sentry）

#### 1. Sentryアカウント作成
[sentry.io](https://sentry.io)で無料アカウント作成

#### 2. プロジェクト設定
```bash
npm install @sentry/react
```

#### 3. 実装
```javascript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
});
```

### アップタイム監視

#### 1. Cloudflare Health Checks（無料）
```
Account → Notifications
- Health Checks → Create
- URL: https://timesync.com
- Check Frequency: 60秒
- Alert: メール通知
```

#### 2. 外部監視サービス
- **UptimeRobot**（無料、5分間隔）
- **Pingdom**（有料、1分間隔）
- **StatusCake**（無料枠あり）

### パフォーマンス監視

#### Lighthouse CI
```bash
# GitHub Actions設定
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://timesync.com
          uploadArtifacts: true
```

---

## 運用・保守

### 日次タスク
- [ ] エラーログ確認（Sentry）
- [ ] アクセス異常確認（CloudflareAnalytics）
- [ ] アップタイム確認

### 週次タスク
- [ ] パフォーマンス測定（Lighthouse）
- [ ] セキュリティアラート確認
- [ ] バックアップ確認（GitHubが自動）

### 月次タスク
- [ ] 依存関係更新
```bash
npm update
npm audit fix
```
- [ ] アクセス分析レポート作成
- [ ] コスト確認（ドメイン以外は0円のはず）

### 緊急時対応

#### サイトダウン時
1. Cloudflare Statusページ確認
2. ビルドログ確認
3. ロールバック実行
```
Pages → Deployments → 前のバージョン → Rollback
```

#### セキュリティインシデント
1. WAFログ確認
2. 該当IPをブロック
```
Security → WAF → Custom Rules → Block IP
```
3. インシデントレポート作成

### アップデート手順

#### 1. ローカルでテスト
```bash
git pull origin main
npm install
npm run dev
# テスト実施
npm run build
```

#### 2. ステージング環境（プレビュー）
```bash
git checkout -b feature/update-xxx
git push origin feature/update-xxx
# Cloudflareが自動でプレビューURL生成
```

#### 3. 本番デプロイ
```bash
git checkout main
git merge feature/update-xxx
git push origin main
# 自動デプロイ開始
```

### バックアップとリストア

#### バックアップ
- **コード**: GitHub（自動）
- **環境変数**: ローカルに`.env.backup`保存
- **設定**: このドキュメントを更新

#### リストア手順
1. GitHubから前のコミットをチェックアウト
2. Cloudflareでロールバック
3. 環境変数を再設定

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. 「ビルドが失敗する」
```bash
# エラー: Cannot find module
解決: npm install実行、node_modulesキャッシュクリア

# エラー: Build exceeded time limit
解決: ビルドコマンド最適化、不要ファイル削除
```

#### 2. 「Google認証が動作しない」
```
確認項目:
1. クライアントIDが正しいか
2. 承認済みURLに現在のURLが含まれているか
3. http://ではなくhttps://でアクセスしているか
4. ブラウザのサードパーティCookie設定
```

#### 3. 「ページが404エラー」
```
解決:
1. _redirectsファイル確認
2. ビルド出力ディレクトリ確認（dist）
3. デプロイログ確認
```

#### 4. 「サイトが遅い」
```
確認:
1. Cloudflare Analytics → Performance
2. バンドルサイズ確認
3. 画像最適化
4. キャッシュ設定確認
```

#### 5. 「環境変数が読み込まれない」
```
解決:
1. 変数名がVITE_で始まっているか確認
2. Pages → Settings → Environment variables確認
3. 再デプロイ実行
```

### デバッグ方法

#### ブラウザコンソール
```javascript
// 環境変数確認
console.log(import.meta.env);

// API通信確認
fetch('/api/test').then(r => console.log(r));
```

#### Cloudflareログ
```
Pages → Functions → Real-time logs
- リクエスト/レスポンス確認
- エラー詳細表示
```

#### wrangler CLI
```bash
# ローカルでCloudflare環境再現
npm install -g wrangler
wrangler pages dev dist
```

---

## コスト管理

### 月額コスト内訳

| 項目 | 料金 | 備考 |
|------|------|------|
| Cloudflare Pages | ¥0 | 永久無料 |
| カスタムドメイン | ¥120/月 | 年額1,400円÷12 |
| SSL証明書 | ¥0 | Cloudflare提供 |
| CDN | ¥0 | 無制限 |
| Analytics | ¥0 | 基本機能無料 |
| **合計** | **¥120/月** | ドメイン代のみ |

### コスト最適化のコツ
1. ドメインはCloudflareで購入（最安値）
2. 画像はWebP形式で圧縮
3. 不要な外部サービスは使わない
4. Cloudflareの無料機能を最大活用

---

## チェックリスト

### 初回デプロイ前
- [ ] GitHubリポジトリ準備完了
- [ ] ローカルでビルド成功
- [ ] 環境変数の値を準備
- [ ] Google OAuth設定完了

### デプロイ後
- [ ] HTTPSでアクセス可能
- [ ] Google認証動作確認
- [ ] カレンダー連携確認
- [ ] GTM/GA4データ受信確認
- [ ] エラー監視設定完了

### 本番運用開始前
- [ ] カスタムドメイン設定
- [ ] セキュリティヘッダー確認
- [ ] バックアップ手順確立
- [ ] 監視アラート設定
- [ ] ドキュメント最新化

---

## まとめ

### Cloudflare Pagesの真の価値

1. **完全無料**: 月100万PVでも0円
2. **世界最速**: 275都市のCDN
3. **セキュリティ**: エンタープライズ級
4. **簡単**: Git pushだけでデプロイ
5. **拡張性**: Workers、R2、D1と連携可能

### 成功のポイント

1. **最初から本番想定**: セキュリティ、監視を最初から
2. **ドキュメント重視**: 設定はすべて記録
3. **定期メンテナンス**: 月1回は依存関係更新
4. **ユーザーファースト**: GA4でユーザー行動分析

### 次のステップ

1. **機能追加時**: feature branchでプレビュー確認
2. **スケール時**: Workersで動的処理追加
3. **収益化時**: Stripe決済など追加

---

**作成日**: 2025年8月24日  
**最終更新**: 2025年8月24日  
**作成者**: Claude Assistant  
**バージョン**: 1.0.0

## サポート

問題が発生した場合:
1. このドキュメントのトラブルシューティング確認
2. Cloudflare Community（community.cloudflare.com）
3. GitHub Issues（コード関連）

---

これでTimeSyncの本番運用準備は完璧です！🚀