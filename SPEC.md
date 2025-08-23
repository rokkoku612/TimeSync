# ScheduleAvailable 仕様書

## プロジェクト概要
- **プロジェクト名**: ScheduleAvailable
- **バージョン**: 1.0.0
- **最終更新**: 2025-01-22
- **概要**: Googleカレンダーと連携して空き時間を自動検出し、日程調整を効率化するWebアプリケーション

## 機能一覧

### 実装済み機能
1. **多言語対応** - 日本語/英語の切り替え
2. **日時選択** - カレンダーUIによる期間設定
3. **空き時間検索** - 最小時間設定による絞り込み
4. **時間制限設定** - 営業時間内検索など
5. **結果のコピー機能** - ワンクリックでクリップボードにコピー
6. **レスポンシブデザイン** - モバイル/タブレット/デスクトップ対応
7. **ハンバーガーメニュー** - モバイル向けナビゲーション
8. **マニュアルページ** - 使い方ガイド

### 計画中の機能
- Googleカレンダー連携（OAuth2.0認証）
- 複数カレンダー対応
- カスタム時間間隔設定
- エクスポート機能（CSV/JSON）
- ダークモード対応

## アーキテクチャ

### 技術スタック
- **フレームワーク**: React 18.3.1 + TypeScript 5.5.3
- **ビルドツール**: Vite 5.4.2
- **スタイリング**: TailwindCSS 3.4.1
- **アイコン**: Lucide React 0.344.0
- **リンター**: ESLint 9.9.1

### ディレクトリ構造
```
ScheduleAvailable/
├── src/
│   ├── App.tsx                    # メインアプリケーション（725行）
│   ├── App.original.tsx           # オリジナルバックアップ
│   ├── components/
│   │   ├── HamburgerMenu.tsx     # ハンバーガーメニュー
│   │   └── ManualPage.tsx        # マニュアルページ
│   ├── index.css                 # グローバルスタイル
│   ├── main.tsx                  # エントリーポイント
│   └── vite-env.d.ts            # Vite型定義
├── public/                       # 静的ファイル
├── CLAUDE.md                     # 開発ガイド・ルール
├── SPEC.md                       # 本仕様書
└── package.json                  # 依存関係定義
```

## コンポーネント構成

### メインコンポーネント
| コンポーネント | ファイル | 説明 |
|--------------|---------|------|
| App | App.tsx | メインアプリケーション（要リファクタリング） |
| HamburgerMenu | components/HamburgerMenu.tsx | モバイル向けメニュー |
| ManualPage | components/ManualPage.tsx | 使い方ガイドページ |

### 計画中のコンポーネント分割
- CalendarPopup - カレンダーポップアップ
- SearchForm - 検索フォーム
- ResultsList - 検索結果リスト
- LanguageToggle - 言語切り替え

## API仕様

### Google Calendar API（実装予定）
- **認証方式**: OAuth 2.0
- **スコープ**: calendar.readonly
- **エンドポイント**: 
  - `/auth/google` - 認証開始
  - `/auth/callback` - 認証コールバック
  - `/api/calendar/events` - イベント取得
  - `/api/calendar/availability` - 空き時間取得

## データモデル

### TimeSlot
```typescript
interface TimeSlot {
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  duration: number;    // 分単位
}
```

### SearchCriteria
```typescript
interface SearchCriteria {
  startDate: Date;
  endDate: Date;
  minDuration: number;     // 最小時間（分）
  startTimeLimit?: string;  // 開始時刻制限
  endTimeLimit?: string;    // 終了時刻制限
  excludeWeekends?: boolean;
}
```

### Language
```typescript
type Language = 'ja' | 'en';

interface LanguageStrings {
  title: string;
  selectPeriod: string;
  search: string;
  // ... その他の翻訳文字列
}
```

## 依存関係

### 本番依存関係
- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **lucide-react**: ^0.344.0

### 開発依存関係
- **@types/react**: ^18.3.3
- **@types/react-dom**: ^18.3.0
- **@vitejs/plugin-react**: ^4.3.1
- **autoprefixer**: ^10.4.19
- **eslint**: ^9.9.1
- **postcss**: ^8.4.38
- **tailwindcss**: ^3.4.1
- **typescript**: ^5.5.3
- **vite**: ^5.4.2

## 開発環境セットアップ

### 必要条件
- Node.js 18.0.0以上
- npm 9.0.0以上

### インストール手順
```bash
# リポジトリをクローン
git clone [repository-url]
cd ScheduleAvailable

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

### ビルド手順
```bash
# プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

### 環境変数（実装予定）
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=your_api_url
```

## TODO

### Phase 1: リファクタリング（優先度: 高）
- [ ] App.tsx をコンポーネントに分割（725行を適切なサイズに）
- [ ] カスタムフックの抽出（useCalendarState, useLanguage, useAvailabilitySearch）
- [ ] 型定義ファイルの分離（types/index.ts）
- [ ] ユーティリティ関数の分離（dateFormatters, timeSlotGenerator）

### Phase 2: 機能追加（優先度: 中）
- [ ] Google Calendar API連携
- [ ] 複数カレンダー対応
- [ ] カスタム時間間隔設定（15分、30分、60分）
- [ ] エクスポート機能（CSV/JSON/iCal）

### Phase 3: UX改善（優先度: 低）
- [ ] ダークモード対応
- [ ] キーボードナビゲーション
- [ ] アクセシビリティ改善（ARIA属性）
- [ ] ローディング状態の改善
- [ ] エラーハンドリングの強化

### Phase 4: テスト・品質（優先度: 中）
- [ ] ユニットテストの追加（Vitest）
- [ ] E2Eテストの追加（Playwright）
- [ ] Storybook導入
- [ ] CI/CD設定（GitHub Actions）

## 更新履歴

### 2025-01-22
- SPEC.md 初期作成
- CLAUDE.md に仕様書更新ルールを追加
- プロジェクト構造の文書化

---

*このドキュメントは、コードの変更に合わせて常に最新の状態を保つこと。*
*更新時は必ず最終更新日と更新履歴を記載すること。*