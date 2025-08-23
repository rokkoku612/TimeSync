# TimeSync - Claude開発ガイド

## プロジェクト概要

TimeSync（旧ScheduleAvailable）は、Googleカレンダーと連携して空き時間を自動検出し、日程調整を効率化するWebアプリケーションです。

### 技術スタック
- **フレームワーク**: React 18.3.1 + TypeScript
- **ビルドツール**: Vite 5.4.2
- **スタイリング**: TailwindCSS 3.4.1
- **アイコン**: Lucide React 0.344.0
- **リント**: ESLint 9.9.1

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プレビュー
npm run preview

# リント実行
npm run lint
```

## 現在のファイル構造

```
src/
├── App.tsx                    # メインアプリケーション（725行 - 要リファクタリング）
├── components/
│   ├── HamburgerMenu.tsx     # ハンバーガーメニュー
│   └── ManualPage.tsx        # マニュアルページ
├── index.css                 # グローバルスタイル
├── main.tsx                  # アプリケーションエントリーポイント
└── vite-env.d.ts            # Vite型定義
```

## 主要機能

1. **多言語対応** (日本語/英語)
2. **日時選択** - カレンダーUIによる期間設定
3. **空き時間検索** - 最小時間設定による絞り込み
4. **時間制限設定** - 営業時間内検索など
5. **結果のコピー機能** - ワンクリックコピー
6. **レスポンシブデザイン** - モバイル対応

## リファクタリング優先項目

### 1. App.tsx の分割（最優先）
現在725行の大きなファイルになっており、以下のコンポーネント分割が必要：

#### 分割すべきコンポーネント
- `CalendarPopup` → `src/components/CalendarPopup.tsx`
- `SearchForm` → `src/components/SearchForm.tsx`
- `ResultsList` → `src/components/ResultsList.tsx`
- `LanguageToggle` → `src/components/LanguageToggle.tsx`

#### 分割すべきフック
- `useCalendarState` → `src/hooks/useCalendarState.ts`
- `useLanguage` → `src/hooks/useLanguage.ts`
- `useAvailabilitySearch` → `src/hooks/useAvailabilitySearch.ts`

#### 分割すべき型定義
- `src/types/index.ts` - TimeSlot, Language interfaces

#### 分割すべきユーティリティ
- `src/utils/dateFormatters.ts` - 日付フォーマット関数
- `src/utils/timeSlotGenerator.ts` - 空き時間生成ロジック
- `src/constants/languages.ts` - 言語定義

### 2. カスタムCSSの適切な管理
現在inline styleでアニメーションを定義。TailwindCSSに統合または分離ファイル化。

### 3. 状態管理の改善
複雑な状態ロジックをReducerパターンまたはZustandに移行検討。

## 開発ガイドライン

### コンポーネント設計原則
1. **単一責任の原則** - 各コンポーネントは一つの責任のみ
2. **Props型定義の徹底** - TypeScriptインターフェースを必ず定義
3. **React.memo最適化** - 重いコンポーネントは適切にメモ化
4. **カスタムフック活用** - ロジックの再利用性向上

### スタイリング規則
1. **TailwindCSS優先** - カスタムCSSは最小限に
2. **レスポンシブ設計** - モバイルファーストアプローチ
3. **デザインシステム統一** - 色彩・間隔の一貫性維持

### TypeScript使用ルール
1. **厳密な型チェック** - `any`型の使用禁止
2. **インターフェース定義** - すべてのProps/Stateに型定義
3. **型ガード活用** - ランタイム型安全性の確保

## パフォーマンス最適化

### 実装済み最適化
- React.memo for CalendarPopup
- useCallback for event handlers
- useMemo for computed values

### 今後の最適化候補
- Code splitting with React.lazy
- Virtual scrolling for large result lists
- Service Worker for offline functionality

## デザインルール

### 絵文字の使用禁止
- **ルール**: コード、ドキュメント、UI、コミットメッセージで絵文字を使用しない
- **理由**: プロフェッショナルで統一された外観を維持するため
- **適用範囲**: 
  - ソースコード内のコメント
  - マークダウンファイル（CLAUDE.md, SPEC.md等）
  - UIテキスト・ラベル
  - Git コミットメッセージ
  - TODO項目・コメント

## セキュリティ考慮事項

1. **OAuth2.0認証** - Googleカレンダー連携
2. **クライアントサイド処理** - データはサーバー保存なし
3. **XSS対策** - ユーザー入力の適切なエスケープ

## デプロイメント

### 本番環境設定
```bash
npm run build
# dist/フォルダが生成される
```

### 環境変数
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=your_api_url
```

## トラブルシューティング

### よくある問題

1. **ビルドエラー** - TypeScript型チェック失敗
   ```bash
   npm run lint
   # 型エラーを修正後、再ビルド
   ```

2. **カレンダー表示異常** - 日付計算ロジック確認
   ```typescript
   // App.tsx:113-131 changeMonth関数
   ```

3. **言語切り替え失敗** - language state管理確認
   ```typescript
   // App.tsx:444-448 toggleLanguage関数
   ```

## 今後の開発計画

### Phase 1: リファクタリング（優先度: 高）
- [ ] App.tsx コンポーネント分割
- [ ] カスタムフック抽出
- [ ] 型定義ファイル分離

### Phase 2: 機能追加（優先度: 中）
- [ ] 複数カレンダー対応
- [ ] カスタム時間間隔設定
- [ ] エクスポート機能（CSV/JSON）

### Phase 3: UX改善（優先度: 低）
- [ ] ダークモード対応
- [ ] キーボードナビゲーション
- [ ] アクセシビリティ改善

## 貢献ガイド

1. コードを変更する前にリファクタリング計画を確認
2. 新しいコンポーネントは適切なディレクトリに配置
3. TypeScript型定義を必ず追加
4. 変更時はこのファイルも更新

## 🗣️ 開発時の表示ルール

### 日本語表示の徹底
開発作業中は、以下のルールに従って常に日本語で状況を説明すること：

1. **作業開始時**
   ```
   例: 「コンポーネントの分割作業を開始します」
   ```

2. **ファイル操作時**
   ```
   例: 「App.tsxからCalendarPopupコンポーネントを抽出しています」
   ```

3. **エラー発生時**
   ```
   例: 「型エラーが発生しました。修正中です」
   ```

4. **作業完了時**
   ```
   例: 「リファクタリングが完了しました。3つのコンポーネントに分割しました」
   ```

### TodoWriteツールの活用
SPEC.md更新を忘れないために、必ずTodoWriteツールを使用すること：

```typescript
// 作業開始時のTODO例
[
  { content: "コンポーネントの分割作業", status: "in_progress" },
  { content: "テストの実行", status: "pending" },
  { content: "SPEC.mdの更新", status: "pending" }  // 必須項目
]
```

### TODO表示ルール

#### 1. TODOリストの日本語表記
すべてのTODOアイテムは日本語で記載し、ユーザーが理解しやすいようにすること：

**表示形式の例：**
```
現在のTODOリスト:
[完了] App.tsxの分析
[作業中] CalendarPopupコンポーネントの作成
[待機中] 型定義の追加
[待機中] テストの作成
[待機中] SPEC.mdの更新
```

#### 2. ステータス表示のルール
- `completed` → [完了]
- `in_progress` → [作業中]
- `pending` → [待機中]

#### 3. TODO更新時の報告
TODOリストを更新するたびに、以下の形式で報告すること：

```
TODOリストを更新しました：

新しく追加したタスク:
- SearchFormコンポーネントの作成

完了したタスク:
- [完了] CalendarPopupコンポーネントの作成

現在作業中:
- [作業中] SearchFormコンポーネントの作成

残りのタスク: 3件
```

#### 4. 作業開始・終了時の宣言
```
// 作業開始時
「SearchFormコンポーネントの作成を開始します」

// 作業完了時
「SearchFormコンポーネントの作成が完了しました」
「次は型定義の追加を行います」
```

## 仕様書更新ルール

### 必須更新タイミング
以下の変更を行った場合は、必ず `SPEC.md` を更新すること：

1. **新機能追加時**
   - 機能の概要と使用方法を記載
   - 関連するコンポーネント/フックを明記

2. **コンポーネント追加/変更時**
   - コンポーネント一覧を更新
   - Props/インターフェースの変更を反映

3. **依存関係の変更時**
   - package.jsonの変更に合わせて更新
   - メジャーバージョンアップは理由を記載

4. **ディレクトリ構造の変更時**
   - ファイル構成セクションを更新
   - 移動/削除の履歴を記録

### 更新手順
```bash
# 1. コード変更を実施
# 2. SPEC.mdを開く
# 3. 以下のセクションを確認・更新
#    - 最終更新日時
#    - バージョン番号（必要に応じて）
#    - 変更内容に該当するセクション
#    - 更新履歴に変更内容を追記
# 4. コミット時にSPEC.mdも含める
git add . && git commit -m "feat: 機能追加 + 仕様書更新"
```

### 重要な注意事項
**コード変更時は必ずTodoWriteツールでSPEC.md更新タスクを追加すること！**

```typescript
// 良い例：TODOにSPEC.md更新を含める
TodoWrite.todos = [
  { content: "CalendarPopupコンポーネントを作成", status: "completed" },
  { content: "Propsの型定義を追加", status: "completed" },
  { content: "SPEC.mdにコンポーネント情報を追加", status: "in_progress" }
]

// 悪い例：SPEC.md更新を忘れている
TodoWrite.todos = [
  { content: "CalendarPopupコンポーネントを作成", status: "completed" },
  { content: "Propsの型定義を追加", status: "completed" }
  // 注意: SPEC.md更新タスクが抜けている！
]
```

### SPEC.md 更新チェックリスト
- [ ] 最終更新日時を更新した
- [ ] 機能一覧に新機能を追加した（該当する場合）
- [ ] コンポーネント一覧を更新した（該当する場合）
- [ ] 依存関係を更新した（該当する場合）
- [ ] 更新履歴セクションに記載した
- [ ] TODOリストを見直した

### 仕様書の構成
SPEC.mdは以下の構成を維持すること：
1. プロジェクト概要
2. 機能一覧
3. アーキテクチャ
4. コンポーネント構成
5. API仕様
6. データモデル
7. 依存関係
8. 開発環境セットアップ
9. TODO
10. 更新履歴

---

**注意**: App.tsxの大規模リファクタリングを開始する前に、必ず現在の動作を確認し、テストケースを準備してください。