import React from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { Language } from '../types';

interface GoogleLoginProps {
  isSignedIn: boolean;
  isLoading: boolean;
  user: { name: string; email: string; imageUrl: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  language: Language;
  error: string | null;
  isDemoMode?: boolean;
  onToggleDemoMode?: () => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({
  isSignedIn,
  isLoading,
  user,
  onSignIn,
  onSignOut,
  language,
  error,
  isDemoMode = false,
  onToggleDemoMode
}) => {
  const texts = {
    ja: {
      signInWithGoogle: 'Googleでログイン',
      signOut: 'ログアウト',
      connecting: '接続中...',
      connectedAs: 'としてログイン中',
      notConnected: 'カレンダー未接続',
      connectCalendar: 'Googleカレンダーと連携して空き時間を自動検出',
      demoMode: 'デモモード',
      tryDemo: 'デモを試す',
      exitDemo: 'デモを終了'
    },
    en: {
      signInWithGoogle: 'Sign in with Google',
      signOut: 'Sign out',
      connecting: 'Connecting...',
      connectedAs: 'Signed in as',
      notConnected: 'Calendar not connected',
      connectCalendar: 'Connect Google Calendar to auto-detect availability',
      demoMode: 'Demo Mode',
      tryDemo: 'Try Demo',
      exitDemo: 'Exit Demo'
    }
  };

  const t = texts[language.code];

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600">{t.connecting}</span>
        </div>
      </div>
    );
  }

  if (isSignedIn && user) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                {isDemoMode && (
                  <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded text-center">
                    {t.demoMode}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut size={14} />
            <span>{t.signOut}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>
        
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-1">{t.notConnected}</h3>
          <p className="text-sm text-gray-600">{t.connectCalendar}</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onSignIn}
            className="flex items-center justify-center gap-3 px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-300 transition-all hover:shadow-md"
          >
            <LogIn size={18} />
            <span>{t.signInWithGoogle}</span>
          </button>
          
          {onToggleDemoMode && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          )}
          
          {onToggleDemoMode && (
            <button
              onClick={onToggleDemoMode}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <span>{t.tryDemo}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;