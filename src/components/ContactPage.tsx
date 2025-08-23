import React from 'react';
import { X, Mail, MessageSquare, Github, Twitter, Send } from 'lucide-react';
import { Language } from '../types';

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const ContactPage: React.FC<ContactPageProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const content = {
    ja: {
      title: 'お問い合わせ',
      subtitle: 'ご意見・ご要望をお聞かせください',
      description: 'TimeSyncへのご意見、ご要望、不具合のご報告など、お気軽にお問い合わせください。',
      contactMethods: 'お問い合わせ方法',
      emailTitle: 'メール',
      emailDesc: 'support@timesync.com',
      emailNote: '営業日2-3日以内に返信いたします',
      githubTitle: 'GitHub Issues',
      githubDesc: 'バグ報告・機能リクエスト',
      githubNote: '技術的な問題や機能要望はこちら',
      twitterTitle: 'Twitter',
      twitterDesc: '@TimeSync',
      twitterNote: '最新情報やアップデートをお知らせ',
      faqTitle: 'よくある質問',
      faq1Q: 'Googleカレンダーと連携できません',
      faq1A: 'Googleアカウントでログインし、カレンダーへのアクセス許可を確認してください。',
      faq2Q: '空き時間が正しく表示されません',
      faq2A: 'カレンダー選択で対象カレンダーが選択されているか確認してください。',
      faq3Q: 'データは安全ですか？',
      faq3A: 'すべてのデータはブラウザ内で処理され、外部サーバーには保存されません。',
      responseTime: '返信時間',
      responseTimeDesc: '通常2-3営業日以内にご返信いたします',
      privacy: 'プライバシー',
      privacyDesc: 'お問い合わせ内容は適切に管理し、サービス改善のみに使用します'
    },
    en: {
      title: 'Contact',
      subtitle: 'We\'d love to hear from you',
      description: 'Feel free to contact us with your feedback, suggestions, or bug reports about TimeSync.',
      contactMethods: 'Contact Methods',
      emailTitle: 'Email',
      emailDesc: 'support@timesync.com',
      emailNote: 'We\'ll respond within 2-3 business days',
      githubTitle: 'GitHub Issues',
      githubDesc: 'Bug reports & Feature requests',
      githubNote: 'For technical issues and feature requests',
      twitterTitle: 'Twitter',
      twitterDesc: '@TimeSync',
      twitterNote: 'Latest news and updates',
      faqTitle: 'Frequently Asked Questions',
      faq1Q: 'Cannot connect to Google Calendar',
      faq1A: 'Please sign in with your Google account and confirm calendar access permissions.',
      faq2Q: 'Available times are not displayed correctly',
      faq2A: 'Please check if the target calendars are selected in the calendar selector.',
      faq3Q: 'Is my data safe?',
      faq3A: 'All data is processed in your browser and never stored on external servers.',
      responseTime: 'Response Time',
      responseTimeDesc: 'We typically respond within 2-3 business days',
      privacy: 'Privacy',
      privacyDesc: 'Your inquiries are properly managed and used only for service improvement'
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

      {/* Contact Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-4xl bg-white shadow-xl animate-slideUp overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-xl font-medium text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 pb-20">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                {t.description}
              </p>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {t.contactMethods}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="mailto:support@timesync.com"
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <Mail size={20} className="text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">{t.emailTitle}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{t.emailDesc}</p>
                <p className="text-xs text-gray-500">{t.emailNote}</p>
              </a>

              <a
                href="https://github.com/timesync/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                    <Github size={20} className="text-gray-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">{t.githubTitle}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{t.githubDesc}</p>
                <p className="text-xs text-gray-500">{t.githubNote}</p>
              </a>

              <a
                href="https://twitter.com/TimeSync"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-sky-300 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                    <Twitter size={20} className="text-sky-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">{t.twitterTitle}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{t.twitterDesc}</p>
                <p className="text-xs text-gray-500">{t.twitterNote}</p>
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {t.faqTitle}
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Q: {t.faq1Q}</h3>
                <p className="text-sm text-gray-600">A: {t.faq1A}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Q: {t.faq2Q}</h3>
                <p className="text-sm text-gray-600">A: {t.faq2A}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Q: {t.faq3Q}</h3>
                <p className="text-sm text-gray-600">A: {t.faq3A}</p>
              </div>
            </div>
          </section>

          {/* Additional Info */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} />
                  {t.responseTime}
                </h3>
                <p className="text-sm text-gray-600">{t.responseTimeDesc}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Send size={16} />
                  {t.privacy}
                </h3>
                <p className="text-sm text-gray-600">{t.privacyDesc}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;