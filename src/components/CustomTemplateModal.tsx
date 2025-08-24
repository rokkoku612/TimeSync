import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Language } from '../types';
import { CopyTemplate, saveCustomTemplate, deleteCustomTemplate } from '../constants/copyTemplates';

interface CustomTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  editingTemplate?: CopyTemplate | null;
  onSave: () => void;
}

const CustomTemplateModal: React.FC<CustomTemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  language, 
  editingTemplate,
  onSave
}) => {
  const [name, setName] = useState(editingTemplate?.nameJa || '');
  const [beforeText, setBeforeText] = useState(editingTemplate?.beforeTextJa || '');
  const [afterText, setAfterText] = useState(editingTemplate?.afterTextJa || '');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name) {
      alert(language.code === 'ja' ? 'テンプレート名を入力してください' : 'Please enter template name');
      return;
    }

    const template: CopyTemplate = {
      id: editingTemplate?.id || `custom-${Date.now()}`,
      nameJa: name,
      nameEn: name,
      beforeTextJa: beforeText,
      beforeTextEn: beforeText,
      afterTextJa: afterText,
      afterTextEn: afterText,
      isCustom: true
    };

    saveCustomTemplate(template);
    onSave();
    onClose();
    resetForm();
  };

  const handleDelete = () => {
    if (editingTemplate?.id && editingTemplate?.isCustom) {
      if (confirm(language.code === 'ja' ? 'このテンプレートを削除しますか？' : 'Delete this template?')) {
        deleteCustomTemplate(editingTemplate.id);
        onSave();
        onClose();
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setName('');
    setBeforeText('');
    setAfterText('');
  };

  const getPreviewText = () => {
    const sampleSlot = language.code === 'ja' 
      ? '12月1日(金) 14:00 - 15:00' 
      : 'Dec 1 (Fri) 14:00 - 15:00';
    
    return `${beforeText}${beforeText ? '\n' : ''}${sampleSlot}\n${sampleSlot}\n${sampleSlot}${afterText}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">
              {editingTemplate 
                ? (language.code === 'ja' ? 'テンプレート編集' : 'Edit Template')
                : (language.code === 'ja' ? 'カスタムテンプレート作成' : 'Create Custom Template')
              }
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <div className="flex items-start gap-2">
              <span className="font-semibold">⚠️</span>
              <div>
                <div className="font-semibold mb-1">
                  {language.code === 'ja' ? 'データ保存についての注意' : 'Data Storage Notice'}
                </div>
                <div className="space-y-1">
                  <p>
                    {language.code === 'ja' 
                      ? 'カスタムテンプレートはブラウザのローカルストレージに保存されます。'
                      : 'Custom templates are saved in your browser\'s local storage.'
                    }
                  </p>
                  <p className="font-medium">
                    {language.code === 'ja' 
                      ? '以下の場合、データが削除されます：'
                      : 'Data will be deleted when:'
                    }
                  </p>
                  <ul className="list-disc list-inside ml-2 space-y-0.5">
                    <li>
                      {language.code === 'ja' 
                        ? 'ブラウザのキャッシュ・閲覧履歴をクリアした時'
                        : 'You clear browser cache or browsing history'
                      }
                    </li>
                    <li>
                      {language.code === 'ja' 
                        ? 'シークレット/プライベートモードを使用している場合（ブラウザを閉じた時）'
                        : 'Using incognito/private mode (when closing browser)'
                      }
                    </li>
                    <li>
                      {language.code === 'ja' 
                        ? '異なるブラウザや端末からアクセスした場合（データは共有されません）'
                        : 'Accessing from different browser or device (data is not shared)'
                      }
                    </li>
                    <li>
                      {language.code === 'ja' 
                        ? 'ブラウザの設定でサイトデータを削除した時'
                        : 'Deleting site data in browser settings'
                      }
                    </li>
                  </ul>
                  <p className="mt-2 text-blue-700">
                    {language.code === 'ja' 
                      ? '💡 ヒント：重要なテンプレートは、テキストをメモ帳などに保存しておくことをお勧めします。'
                      : '💡 Tip: We recommend saving important templates in a text file as backup.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 左側: 入力フォーム */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language.code === 'ja' ? 'テンプレート名' : 'Template Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={language.code === 'ja' ? '例: カスタムテンプレート' : 'e.g. Custom Template'}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {language.code === 'ja' 
                    ? '※ 言語切り替え時も同じ名前が表示されます'
                    : '※ The same name will be displayed when switching languages'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language.code === 'ja' ? '前文' : 'Before Text'}
                </label>
                <textarea
                  value={beforeText}
                  onChange={(e) => setBeforeText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder={language.code === 'ja' 
                    ? '日程の前に表示するテキスト\n例: お忙しいところ恐れ入りますが、以下の日程よりご都合のよろしい時間帯をお選びください。' 
                    : 'Text to display before dates\ne.g. Please select your preferred time slot from the following available dates.'
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language.code === 'ja' ? '後文' : 'After Text'}
                </label>
                <textarea
                  value={afterText}
                  onChange={(e) => setAfterText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder={language.code === 'ja' 
                    ? '日程の後に表示するテキスト\n例: ご都合のよろしい日時をお知らせください。' 
                    : 'Text to display after dates\ne.g. Please let me know which time works best for you.'
                  }
                />
              </div>
              
            </div>

            {/* 右側: プレビュー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language.code === 'ja' ? 'プレビュー' : 'Preview'}
              </label>
              <div className="bg-gray-50 rounded-lg p-4 h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {getPreviewText()}
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <div>
            {editingTemplate?.isCustom && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                {language.code === 'ja' ? '削除' : 'Delete'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {language.code === 'ja' ? 'キャンセル' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {language.code === 'ja' ? '保存' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTemplateModal;