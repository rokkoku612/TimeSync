import React from 'react';
import { X, Shield, Lock, FileText, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface TermsPageProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const TermsPage: React.FC<TermsPageProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const content = {
    ja: {
      title: '利用規約',
      subtitle: 'TimeSync サービス利用規約',
      lastUpdated: '最終更新日: 2025年1月',
      sections: [
        {
          title: '1. サービスの概要',
          content: 'TimeSync（以下「本サービス」）は、Googleカレンダーと連携して空き時間を検索・共有するWebアプリケーションです。本サービスはブラウザ上で動作し、ユーザーのデータを外部サーバーに保存することはありません。'
        },
        {
          title: '2. 利用条件',
          content: '本サービスを利用するには、以下の条件を満たす必要があります：\n\n• 有効なGoogleアカウントを保有していること\n• 本利用規約に同意すること\n• 適切な目的で本サービスを利用すること'
        },
        {
          title: '3. プライバシーとデータ保護',
          content: '本サービスは以下のプライバシー原則に基づいて運営されています：\n\n• すべてのカレンダーデータはブラウザ内で処理されます\n• 外部サーバーにユーザーデータを送信・保存しません\n• Googleの認証情報はセッションストレージに一時的に保存され、ブラウザを閉じると削除されます\n• 選択設定（言語、テンプレートなど）はローカルストレージに保存されます'
        },
        {
          title: '4. Googleカレンダーアクセス',
          content: '本サービスは以下の権限を要求します：\n\n• カレンダーの読み取り権限\n• カレンダーイベントの作成・編集権限（カレンダービュー機能利用時）\n\nこれらの権限は本サービスの機能提供のみに使用され、他の目的には使用されません。'
        },
        {
          title: '5. 免責事項',
          content: '• 本サービスは現状有姿で提供され、明示的または黙示的な保証はありません\n• 本サービスの利用により生じた損害について、開発者は責任を負いません\n• 本サービスの可用性、正確性、完全性は保証されません\n• Googleのサービス変更により、機能が制限される可能性があります'
        },
        {
          title: '6. 禁止事項',
          content: '以下の行為を禁止します：\n\n• 本サービスを不正な目的で使用すること\n• 他者のプライバシーを侵害する行為\n• 本サービスに過度な負荷をかける行為\n• リバースエンジニアリング、改変、二次配布'
        },
        {
          title: '7. サービスの変更・終了',
          content: '開発者は、事前の通知なく本サービスの内容を変更、または本サービスの提供を終了することがあります。'
        },
        {
          title: '8. 準拠法',
          content: '本利用規約は日本法に準拠し、日本法に従って解釈されます。'
        }
      ],
      accept: '同意する',
      decline: '同意しない',
      notice: '重要なお知らせ',
      noticeContent: '本サービスを利用することで、これらの利用規約に同意したものとみなされます。'
    },
    en: {
      title: 'Terms of Service',
      subtitle: 'TimeSync Terms of Service',
      lastUpdated: 'Last Updated: January 2025',
      sections: [
        {
          title: '1. Service Overview',
          content: 'TimeSync (the "Service") is a web application that searches and shares available time slots by integrating with Google Calendar. The Service operates in your browser and does not store user data on external servers.'
        },
        {
          title: '2. Terms of Use',
          content: 'To use this Service, you must:\n\n• Have a valid Google account\n• Agree to these Terms of Service\n• Use the Service for appropriate purposes'
        },
        {
          title: '3. Privacy and Data Protection',
          content: 'The Service operates based on the following privacy principles:\n\n• All calendar data is processed within your browser\n• No user data is sent to or stored on external servers\n• Google authentication credentials are temporarily stored in session storage and deleted when the browser is closed\n• Preferences (language, templates, etc.) are stored in local storage'
        },
        {
          title: '4. Google Calendar Access',
          content: 'The Service requests the following permissions:\n\n• Read access to calendars\n• Create and edit calendar events (when using calendar view features)\n\nThese permissions are used solely for providing the Service functionality and not for any other purposes.'
        },
        {
          title: '5. Disclaimer',
          content: '• The Service is provided "as is" without any express or implied warranties\n• The developers are not liable for any damages arising from the use of the Service\n• The availability, accuracy, and completeness of the Service are not guaranteed\n• Functionality may be limited due to changes in Google services'
        },
        {
          title: '6. Prohibited Activities',
          content: 'The following activities are prohibited:\n\n• Using the Service for illegal purposes\n• Violating others\' privacy\n• Placing excessive load on the Service\n• Reverse engineering, modification, or redistribution'
        },
        {
          title: '7. Service Changes and Termination',
          content: 'The developers may change the Service content or terminate the Service without prior notice.'
        },
        {
          title: '8. Governing Law',
          content: 'These Terms of Service are governed by and construed in accordance with the laws of Japan.'
        }
      ],
      accept: 'Accept',
      decline: 'Decline',
      notice: 'Important Notice',
      noticeContent: 'By using this Service, you are deemed to have agreed to these Terms of Service.'
    }
  };

  const t = content[language.code];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Terms Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-4xl bg-pure-white shadow-float animate-slideUp overflow-y-auto">
        <div className="sticky top-0 bg-pure-white/95 backdrop-blur-xl border-b border-mist z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-xl font-medium text-ink tracking-tight">{t.title}</h1>
              <p className="text-sm text-graphite mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-graphite hover:text-ink hover:bg-pearl rounded-lg transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 pb-20">
          {/* Last Updated */}
          <div className="mb-8 text-sm text-graphite">
            {t.lastUpdated}
          </div>

          {/* Important Notice */}
          <div className="mb-8 p-4 bg-soft-white border border-mist rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-charcoal mt-0.5" />
              <div>
                <h3 className="font-medium text-ink mb-1">{t.notice}</h3>
                <p className="text-sm text-charcoal">{t.noticeContent}</p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {t.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-lg font-medium text-ink mb-4 flex items-center gap-2">
                  {index === 2 && <Lock size={18} className="text-charcoal" />}
                  {index === 3 && <Shield size={18} className="text-charcoal" />}
                  {index === 4 && <FileText size={18} className="text-charcoal" />}
                  {section.title}
                </h2>
                <div className="text-sm text-charcoal leading-relaxed whitespace-pre-line p-4 bg-soft-white rounded-lg border border-mist">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-mist">
            <p className="text-sm text-graphite text-center">
              © 2025 TimeSync. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;