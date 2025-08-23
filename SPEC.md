# TimeSync 仕様書

## プロジェクト概要
- **プロジェクト名**: TimeSync（旧TimeSync）
- **バージョン**: 1.2.0
- **最終更新**: 2025-01-23
- **概要**: Googleカレンダーと連携して空き時間を自動検出し、日程調整を効率化するWebアプリケーション

## 機能一覧

### 実装済み機能
1. **多言語対応** - 日本語/英語の完全切り替えサポート
2. **Googleカレンダー連携** - OAuth2.0認証、デモモード完備
3. **複数カレンダー対応** - カレンダー選択機能
4. **日時選択** - インタラクティブなカレンダーUI
5. **空き時間検索** - 最小時間設定、時間制限機能
6. **結果のコピー機能** - テンプレート対応のワンクリックコピー
7. **レスポンシブデザイン** - モバイル/タブレット/デスクトップ完全対応
8. **ナビゲーション** - ハンバーガーメニュー、タブ機能
9. **情報ページ** - マニュアル、お問い合わせ、利用規約、About
10. **イベント管理** - イベント表示、作成、編集、削除機能
11. **カレンダービュー** - 日表示、月表示、イベント詳細表示

### 計画中の機能
- ダークモード対応
- カスタム時間間隔設定（15分/30分/60分）
- エクスポート機能（CSV/JSON/iCal）
- 通知機能
- 定期イベント対応

## アーキテクチャ

### 技術スタック
- **フレームワーク**: React 18.3.1 + TypeScript 5.5.3
- **ビルドツール**: Vite 5.4.2
- **スタイリング**: TailwindCSS 3.4.1
- **アイコン**: Lucide React 0.344.0
- **リンター**: ESLint 9.9.1

### ディレクトリ構造
```
TimeSync/
├── src/
│   ├── App.tsx                           # メインアプリケーション（305行）
│   ├── main.tsx                          # エントリーポイント
│   ├── index.css                         # グローバルスタイル
│   ├── vite-env.d.ts                    # Vite型定義
│   ├── components/                       # UIコンポーネント
│   │   ├── AboutPage.tsx                # About情報ページ
│   │   ├── CalendarPopup.tsx            # カレンダーポップアップ
│   │   ├── CalendarSelector.tsx         # カレンダー選択UI
│   │   ├── ContactPage.tsx              # お問い合わせページ
│   │   ├── CopyTemplateSelector.tsx     # コピーテンプレート選択
│   │   ├── DayViewModal.tsx             # 日表示モーダル
│   │   ├── EventModal.tsx               # イベント作成・編集モーダル
│   │   ├── EventsDisplay.tsx            # イベント一覧表示
│   │   ├── GoogleCalendarView.tsx       # カレンダービュー
│   │   ├── GoogleLogin.tsx              # Google認証コンポーネント
│   │   ├── HamburgerMenu.tsx            # ハンバーガーメニュー
│   │   ├── HelpTooltip.tsx              # ヘルプツールチップ
│   │   ├── LanguageToggle.tsx           # 言語切り替え
│   │   ├── ManualPage.tsx               # マニュアルページ
│   │   ├── ResultsList.tsx              # 検索結果リスト
│   │   ├── SearchForm.tsx               # 検索フォーム
│   │   ├── TermsPage.tsx                # 利用規約ページ
│   │   └── TimePicker.tsx               # 時間選択コンポーネント
│   ├── hooks/                           # カスタムフック
│   │   ├── useAvailabilitySearch.ts     # 空き時間検索ロジック
│   │   ├── useCalendarState.ts          # カレンダー状態管理
│   │   ├── useGoogleAuth.ts             # Google認証管理
│   │   └── useLanguage.ts               # 多言語対応
│   ├── services/                        # 外部API連携
│   │   ├── googleAuthDirect.ts          # Direct OAuth実装
│   │   └── googleCalendar.ts            # Google Calendar API
│   ├── types/                           # TypeScript型定義
│   │   └── index.ts                     # 共通型定義
│   ├── utils/                           # ユーティリティ関数
│   │   ├── dateFormatters.ts            # 日付フォーマット
│   │   ├── sanitizer.ts                 # 入力値検証
│   │   └── timeSlotGenerator.ts         # 時間スロット生成
│   ├── constants/                       # 定数定義
│   │   ├── copyTemplates.ts             # コピーテンプレート
│   │   └── languages.ts                 # 言語設定
│   └── config/                          # 設定ファイル
│       └── google.ts                    # Google API設定
├── public/                              # 静的ファイル
├── dist/                                # ビルド出力
├── docs/                                # ドキュメント
│   ├── CLAUDE.md                        # 開発ガイド
│   ├── SPEC.md                          # 本仕様書
│   ├── GOOGLE_SETUP.md                  # Google API設定
│   └── OAUTH_CHECKLIST.md               # OAuth設定チェックリスト
├── terraform/                           # インフラ設定
└── package.json                         # 依存関係定義
```

## コンポーネント構成

### コンポーネント一覧
| カテゴリ | コンポーネント | ファイル | 説明 |
|---------|--------------|---------|------|
| **メイン** | App | App.tsx | メインアプリケーション |
| **認証** | GoogleLogin | GoogleLogin.tsx | Google OAuth認証 |
| **UI基盤** | HamburgerMenu | HamburgerMenu.tsx | モバイル向けメニュー |
| | LanguageToggle | LanguageToggle.tsx | 言語切り替えボタン |
| | HelpTooltip | HelpTooltip.tsx | ヘルプツールチップ |
| **検索機能** | SearchForm | SearchForm.tsx | 空き時間検索フォーム |
| | ResultsList | ResultsList.tsx | 検索結果表示リスト |
| | CopyTemplateSelector | CopyTemplateSelector.tsx | コピーテンプレート選択 |
| **カレンダー** | CalendarPopup | CalendarPopup.tsx | 日付選択カレンダー |
| | GoogleCalendarView | GoogleCalendarView.tsx | カレンダー表示 |
| | CalendarSelector | CalendarSelector.tsx | 複数カレンダー選択 |
| | DayViewModal | DayViewModal.tsx | 日単位詳細表示 |
| | TimePicker | TimePicker.tsx | 時間選択コンポーネント |
| **イベント** | EventsDisplay | EventsDisplay.tsx | イベント一覧表示 |
| | EventModal | EventModal.tsx | イベント作成・編集 |
| **情報ページ** | ManualPage | ManualPage.tsx | 使い方ガイド |
| | AboutPage | AboutPage.tsx | アプリケーション情報 |
| | ContactPage | ContactPage.tsx | お問い合わせ |
| | TermsPage | TermsPage.tsx | 利用規約 |

### カスタムフック
| フック | ファイル | 責任 |
|-------|---------|------|
| useLanguage | hooks/useLanguage.ts | 多言語対応状態管理 |
| useCalendarState | hooks/useCalendarState.ts | カレンダー表示状態管理 |
| useAvailabilitySearch | hooks/useAvailabilitySearch.ts | 空き時間検索ロジック |
| useGoogleAuth | hooks/useGoogleAuth.ts | Google認証状態管理 |

## API仕様

### Google Calendar API（実装済み）
- **認証方式**: OAuth 2.0（Direct Implementation）
- **スコープ**: `https://www.googleapis.com/auth/calendar.readonly`
- **主要エンドポイント**: 
  - `GET /calendar/v3/users/me/calendarList` - カレンダー一覧取得
  - `GET /calendar/v3/calendars/{calendarId}/events` - イベント取得
  - `POST /calendar/v3/calendars/primary/events` - イベント作成
  - `PUT /calendar/v3/calendars/primary/events/{eventId}` - イベント更新
  - `DELETE /calendar/v3/calendars/primary/events/{eventId}` - イベント削除

### デモモード
- **機能**: Google認証なしでのテスト用途
- **データ**: 動的生成された仮想イベント
- **切り替え**: リアルタイムでデモ/実認証モード切り替え可能

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
cd TimeSync

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

### Phase 1: 基本機能（完了）
- [x] App.tsx をコンポーネントに分割（305行に削減完了）
- [x] カスタムフックの抽出（4つのフック実装完了）
- [x] 型定義ファイルの分離（types/index.ts作成完了）
- [x] ユーティリティ関数の分離（utils/配下に3つのファイル分離完了）
- [x] Google Calendar API連携（OAuth2.0認証実装完了）
- [x] 複数カレンダー対応（選択機能実装完了）
- [x] 多言語対応（日本語/英語完全サポート）

### Phase 2: 品質改善（優先度: 高）
- [ ] ESLintエラーの修正（68個のエラーを解決）
- [ ] TypeScriptの厳密化（any型の除去）
- [ ] 未使用変数の除去
- [ ] React Hooksの依存関係修正

### Phase 3: 機能拡張（優先度: 中）
- [ ] カスタム時間間隔設定（15分、30分、60分）
- [ ] エクスポート機能（CSV/JSON/iCal）
- [ ] 通知機能
- [ ] 定期イベント対応

### Phase 4: UX改善（優先度: 中）
- [ ] ダークモード対応
- [ ] キーボードナビゲーション
- [ ] アクセシビリティ改善（ARIA属性）
- [ ] ローディング状態の改善
- [ ] エラーハンドリングの強化

### Phase 5: テスト・品質（優先度: 低）
- [ ] ユニットテストの追加（Vitest）
- [ ] E2Eテストの追加（Playwright）
- [ ] Storybook導入
- [ ] CI/CD設定（GitHub Actions）

## 更新履歴

### 2025-08-23
- プロジェクト状況の大幅更新（v1.2.0）
- 全18コンポーネントの実装状況を反映
- Google Calendar API連携完了を記録
- OAuth2.0認証、デモモード機能の実装完了を追加
- ディレクトリ構造の全面見直し
- Phase 1（基本機能）の完了を記録
- 現在の優先課題をPhase 2（品質改善）に更新

### 2025-01-22
- SPEC.md 初期作成
- CLAUDE.md に仕様書更新ルールを追加
- プロジェクト構造の文書化

---

*このドキュメントは、コードの変更に合わせて常に最新の状態を保つこと。*
*更新時は必ず最終更新日と更新履歴を記載すること。*