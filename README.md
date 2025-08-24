# TimeSync - スマートな日程調整アプリケーション

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS">
</div>

## 📋 概要

TimeSyncは、Googleカレンダーと連携して空き時間を自動検出し、効率的な日程調整を実現するWebアプリケーションです。複数のカレンダーを統合管理し、最適な会議時間を瞬時に見つけることができます。

### ✨ 主な特徴

- 🔍 **スマート空き時間検索** - 複数カレンダーから自動で空き時間を検出
- 📅 **Googleカレンダー完全統合** - リアルタイムで予定を同期・管理
- 🌐 **多言語対応** - 日本語/英語の切り替えが可能
- 📱 **レスポンシブデザイン** - PC、タブレット、スマートフォンに最適化
- 🎨 **カスタマイズ可能** - テンプレート作成、週始まり設定など
- 🔒 **セキュアな認証** - OAuth 2.0による安全なGoogle認証

## 🚀 クイックスタート

### 前提条件

- Node.js 18.17.0以上
- npm 9.6.7以上
- Google Cloud Consoleアカウント
- Googleカレンダーアクセス権限

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/TimeSync.git
cd TimeSync

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してGoogle Client IDを設定
```

### Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. 「APIとサービス」→「認証情報」から OAuth 2.0 クライアントIDを作成
4. 承認済みJavaScriptオリジンに以下を追加：
   - `http://localhost:5173`
   - `http://localhost:5174`
   - `https://your-domain.com`（本番環境）

### 開発サーバーの起動

```bash
# 開発モードで起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

### ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 🎯 主要機能

### 1. 空き時間検索
- 期間を指定して空き時間を自動検出
- 最小時間単位の設定（15分、30分、60分）
- 営業時間内のみの検索オプション
- 複数カレンダーの統合検索

### 2. カレンダー表示
- 月表示/週表示の切り替え
- 日曜始まり/月曜始まりの選択
- ドラッグ&ドロップで予定の移動
- 複数カレンダーの色分け表示

### 3. 予定管理
- 新規予定の作成
- 既存予定の編集・削除
- Google Meet自動追加
- ゲスト招待とメール通知

### 4. テンプレート機能
- 標準テンプレート8種類
- カスタムテンプレートの作成・編集
- LINEやメール用の最適化フォーマット

### 5. 多言語対応
- 日本語/英語の即時切り替え
- 日付フォーマットの自動調整
- タイムゾーン対応

## 🛠️ 技術スタック

### フロントエンド
- **React 18.3.1** - UIライブラリ
- **TypeScript 5.5.3** - 型安全な開発
- **Vite 5.4.2** - 高速ビルドツール
- **TailwindCSS 3.4.1** - ユーティリティファーストCSS

### 状態管理
- **React Hooks** - useState, useEffect, useCallback
- **Custom Hooks** - ビジネスロジックの分離
- **LocalStorage** - 設定の永続化

### API連携
- **Google Calendar API v3** - カレンダーデータの取得・更新
- **OAuth 2.0** - セキュアな認証

### 開発ツール
- **ESLint 9.9.1** - コード品質管理
- **PostCSS** - CSS処理
- **Autoprefixer** - ベンダープレフィックス自動付与

## 📁 プロジェクト構造

```
TimeSync/
├── src/
│   ├── components/         # Reactコンポーネント
│   │   ├── CalendarSelector.tsx
│   │   ├── CustomTemplateModal.tsx
│   │   ├── EventModal.tsx
│   │   ├── GoogleCalendarView.tsx
│   │   ├── GoogleLogin.tsx
│   │   ├── MainContent.tsx
│   │   ├── ResultsList.tsx
│   │   ├── SearchForm.tsx
│   │   ├── TabNavigation.tsx
│   │   ├── WeekStartSelector.tsx
│   │   └── WeekView.tsx
│   ├── hooks/              # カスタムフック
│   │   ├── useAppState.ts
│   │   ├── useAvailabilitySearch.ts
│   │   ├── useCalendarState.ts
│   │   ├── useGoogleAuth.ts
│   │   └── useLocalStorage.ts
│   ├── services/           # APIサービス
│   │   ├── googleAuthDirect.ts
│   │   └── googleCalendar.ts
│   ├── constants/          # 定数定義
│   │   ├── copyTemplates.ts
│   │   └── languages.ts
│   ├── utils/              # ユーティリティ関数
│   │   ├── dateFormatters.ts
│   │   └── timeSlotGenerator.ts
│   ├── types/              # TypeScript型定義
│   │   └── index.ts
│   ├── App.tsx             # メインアプリケーション
│   ├── main.tsx            # エントリーポイント
│   └── index.css           # グローバルスタイル
├── public/                 # 静的ファイル
├── dist/                   # ビルド出力
└── package.json           # プロジェクト設定
```

## 🔧 設定とカスタマイズ

### 環境変数

`.env`ファイルで以下の設定が可能：

```env
# Google OAuth設定
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# オプション設定
VITE_DEFAULT_LANGUAGE=ja
VITE_DEFAULT_MIN_DURATION=30
VITE_DEFAULT_WEEK_START=1
```

### カスタマイズ可能な項目

- **言語追加**: `src/constants/languages.ts`に新しい言語を追加
- **テンプレート追加**: `src/constants/copyTemplates.ts`でテンプレートを定義
- **テーマカラー**: `tailwind.config.js`でカラーパレットを調整
- **デフォルト設定**: 各種フックの初期値を変更

## 🚢 デプロイ

### Cloudflare Pages（推奨）

1. Cloudflareアカウントを作成
2. GitHubリポジトリと連携
3. ビルド設定：
   - ビルドコマンド: `npm run build`
   - 出力ディレクトリ: `dist`
4. 環境変数を設定
5. デプロイ実行

詳細は[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)を参照

### その他のプラットフォーム

- Vercel
- Netlify
- Firebase Hosting
- AWS Amplify

## 📊 パフォーマンス

- **初期ロード時間**: < 2秒
- **Lighthouse スコア**:
  - Performance: 95+
  - Accessibility: 98+
  - Best Practices: 100
  - SEO: 92+
- **バンドルサイズ**: ~350KB (gzip圧縮後: ~95KB)

## 🔒 セキュリティ

- OAuth 2.0による認証
- HTTPS必須
- XSS対策（React自動エスケープ）
- CSPヘッダー設定
- 環境変数による機密情報の保護
- セッションベースのトークン管理

## 🧪 テスト

```bash
# リントチェック
npm run lint

# 型チェック
npx tsc --noEmit

# ビルドテスト
npm run build
```

詳細なテスト仕様は[TEST_SPECIFICATION.md](./TEST_SPECIFICATION.md)を参照

## 📝 ドキュメント

- [開発ガイド](./CLAUDE.md) - 開発者向けガイドライン
- [仕様書](./SPEC.md) - 詳細な機能仕様
- [デプロイガイド](./DEPLOYMENT_GUIDE.md) - 本番環境への完全デプロイ手順
- [テスト仕様](./TEST_SPECIFICATION.md) - テストケースと手順
- [テストレポート](./TEST_REPORT.md) - テスト実行結果

## 🤝 コントリビューション

1. フォークする
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📜 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👥 作者

- **開発者** - [Your Name](https://github.com/yourusername)

## 🙏 謝辞

- Google Calendar APIチーム
- React開発コミュニティ
- すべてのコントリビューター

## 📮 お問い合わせ

質問や提案がある場合は、[Issues](https://github.com/yourusername/TimeSync/issues)でお知らせください。

---

<div align="center">
  Made with ❤️ using React and TypeScript
</div>