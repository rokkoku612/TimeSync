import React from 'react';
import { X, User, Code, Target, Twitter, Globe, Shield, Zap, Globe2, Smartphone } from 'lucide-react';
import { Language } from '../types';

interface AboutPageProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const AboutPage: React.FC<AboutPageProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const iconMap = {
    Shield,
    Zap,
    Globe2,
    Smartphone
  };

  const content = {
    ja: {
      title: '開発者情報',
      subtitle: 'TimeSyncについて',
      missionTitle: 'ミッション',
      missionContent: '日程調整の煩わしさから解放し、より大切なことに時間を使えるようにする。',
      storyTitle: '開発ストーリー',
      storyContent: 'TimeSyncは、日々の会議調整に費やす時間を削減したいという思いから生まれました。複数のメールを往復して日程を調整する代わりに、ワンクリックで空き時間を共有できるツールを目指しました。',
      featuresTitle: '特徴',
      features: [
        {
          icon: 'Shield',
          title: 'プライバシーファースト',
          desc: 'すべてのデータはブラウザ内で処理。外部サーバーへの送信なし。'
        },
        {
          icon: 'Zap',
          title: '高速・軽量',
          desc: 'サーバーレスアーキテクチャで高速動作。'
        },
        {
          icon: 'Globe2',
          title: '多言語対応',
          desc: '日本語と英語に対応。グローバルなビジネスシーンで活用。'
        },
        {
          icon: 'Smartphone',
          title: 'レスポンシブデザイン',
          desc: 'PC、タブレット、スマートフォンすべてで快適に利用。'
        }
      ],
      techStackTitle: '技術スタック',
      techStack: [
        { name: 'React', desc: 'UIライブラリ' },
        { name: 'TypeScript', desc: '型安全な開発' },
        { name: 'Tailwind CSS', desc: 'スタイリング' },
        { name: 'Google Calendar API', desc: 'カレンダー連携' },
        { name: 'Vite', desc: 'ビルドツール' }
      ],
      developerTitle: '開発者',
      developerName: 'Ayumu Yoshino',
      developerRole: 'フルスタック開発者',
      developerBio: '生産性向上ツールの開発に情熱を注ぐエンジニア。日々の業務を効率化し、人々がより創造的な活動に時間を使えるようなツールを開発しています。',
      contactTitle: 'コンタクト',
      version: 'バージョン',
      versionNumber: '1.2.0',
      license: 'ライセンス',
      licenseType: 'MIT License',
      supportTitle: 'サポート',
      supportContent: 'もしTimeSyncが役に立ったら、SNSでシェアしていただけると嬉しいです'
    },
    en: {
      title: 'About',
      subtitle: 'About TimeSync',
      missionTitle: 'Our Mission',
      missionContent: 'Free people from the hassle of scheduling and let them spend time on what matters most.',
      storyTitle: 'Development Story',
      storyContent: 'TimeSync was born from the desire to reduce time spent on daily meeting coordination. Instead of exchanging multiple emails to schedule meetings, we aimed to create a tool that shares available times with just one click.',
      featuresTitle: 'Features',
      features: [
        {
          icon: 'Shield',
          title: 'Privacy First',
          desc: 'All data processed in your browser. No external server transmission.'
        },
        {
          icon: 'Zap',
          title: 'Fast & Lightweight',
          desc: 'High-speed operation with serverless architecture.'
        },
        {
          icon: 'Globe2',
          title: 'Multi-language Support',
          desc: 'Available in Japanese and English for global business use.'
        },
        {
          icon: 'Smartphone',
          title: 'Responsive Design',
          desc: 'Comfortable use on PC, tablet, and smartphone.'
        }
      ],
      techStackTitle: 'Tech Stack',
      techStack: [
        { name: 'React', desc: 'UI Library' },
        { name: 'TypeScript', desc: 'Type-safe Development' },
        { name: 'Tailwind CSS', desc: 'Styling' },
        { name: 'Google Calendar API', desc: 'Calendar Integration' },
        { name: 'Vite', desc: 'Build Tool' }
      ],
      developerTitle: 'Developer',
      developerName: 'Ayumu Yoshino',
      developerRole: 'Full Stack Developer',
      developerBio: 'An engineer passionate about developing productivity tools. Creating tools that streamline daily tasks and allow people to spend more time on creative activities.',
      contactTitle: 'Contact',
      version: 'Version',
      versionNumber: '1.2.0',
      license: 'License',
      licenseType: 'MIT License',
      supportTitle: 'Support',
      supportContent: 'If TimeSync has been helpful, we would appreciate you sharing it on social media'
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

      {/* About Panel */}
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
          {/* Mission */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-pearl to-mist rounded-xl p-6">
              <h2 className="text-lg font-medium text-ink mb-3 flex items-center gap-2">
                <Target size={20} className="text-charcoal" />
                {t.missionTitle}
              </h2>
              <p className="text-charcoal leading-relaxed text-lg">
                {t.missionContent}
              </p>
            </div>
          </section>

          {/* Story */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-4">
              {t.storyTitle}
            </h2>
            <p className="text-charcoal leading-relaxed">
              {t.storyContent}
            </p>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6">
              {t.featuresTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
                return (
                  <div key={index} className="p-4 bg-soft-white rounded-lg border border-mist">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pearl rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent size={18} className="text-charcoal" />
                      </div>
                      <div>
                        <h3 className="font-medium text-ink mb-1">{feature.title}</h3>
                        <p className="text-sm text-charcoal">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6 flex items-center gap-2">
              <Code size={20} className="text-charcoal" />
              {t.techStackTitle}
            </h2>
            <div className="flex flex-wrap gap-3">
              {t.techStack.map((tech, index) => (
                <div key={index} className="px-4 py-2 bg-pure-white border border-mist rounded-lg">
                  <span className="font-medium text-ink">{tech.name}</span>
                  <span className="text-sm text-graphite ml-2">• {tech.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Developer */}
          <section className="mb-12">
            <h2 className="text-lg font-medium text-ink mb-6 flex items-center gap-2">
              <User size={20} className="text-charcoal" />
              {t.developerTitle}
            </h2>
            <div className="p-6 bg-gradient-to-r from-soft-white to-pearl rounded-xl border border-mist">
              <h3 className="font-medium text-ink text-lg mb-1">{t.developerName}</h3>
              <p className="text-sm text-graphite mb-3">{t.developerRole}</p>
              <p className="text-charcoal leading-relaxed mb-4">
                {t.developerBio}
              </p>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/ayumuyoshino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pure-white rounded-lg hover:bg-pearl transition-colors border border-mist"
                >
                  <Twitter size={20} className="text-charcoal" />
                </a>
                <a
                  href="https://ayumuyoshino.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-pure-white rounded-lg hover:bg-pearl transition-colors border border-mist"
                >
                  <Globe size={20} className="text-charcoal" />
                </a>
              </div>
            </div>
          </section>

          {/* Additional Info */}
          <section className="mb-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-soft-white rounded-lg border border-mist">
                <h3 className="text-sm font-medium text-graphite mb-1">{t.version}</h3>
                <p className="text-ink">{t.versionNumber}</p>
              </div>
              <div className="p-4 bg-soft-white rounded-lg border border-mist">
                <h3 className="text-sm font-medium text-graphite mb-1">{t.license}</h3>
                <p className="text-ink">{t.licenseType}</p>
              </div>
            </div>
          </section>

          {/* Support */}
          <section>
            <div className="p-6 bg-gradient-to-r from-pearl to-soft-white rounded-xl text-center border border-mist">
              <h3 className="font-medium text-ink mb-2">{t.supportTitle}</h3>
              <p className="text-charcoal">
                {t.supportContent}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;