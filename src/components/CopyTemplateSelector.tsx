import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, FileText, Plus, Edit2, X } from 'lucide-react';
import { Language } from '../types';
import { getAllTemplates, CopyTemplate, getDefaultTemplate, saveSelectedTemplate } from '../constants/copyTemplates';
import CustomTemplateModal from './CustomTemplateModal';

interface CopyTemplateSelectorProps {
  language: Language;
  onTemplateChange: (template: CopyTemplate) => void;
}

const CopyTemplateSelector: React.FC<CopyTemplateSelectorProps> = ({ 
  language, 
  onTemplateChange
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(getDefaultTemplate());
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CopyTemplate | null>(null);
  const [templates, setTemplates] = useState<CopyTemplate[]>(getAllTemplates());

  useEffect(() => {
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      onTemplateChange(template);
    }
  }, [selectedTemplateId, onTemplateChange, templates]);

  const refreshTemplates = () => {
    const allTemplates = getAllTemplates();
    setTemplates(allTemplates);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    saveSelectedTemplate(templateId);
    // ドロップダウンを閉じない（ユーザーが手動で閉じるまで開いたまま）
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const templateName = language.code === 'ja' ? selectedTemplate?.nameJa : selectedTemplate?.nameEn;

  const getPreviewText = (template: CopyTemplate) => {
    const beforeText = language.code === 'ja' ? template.beforeTextJa : template.beforeTextEn;
    const afterText = language.code === 'ja' ? template.afterTextJa : template.afterTextEn;
    
    let sampleSlot: string;
    if (template.formatFunction) {
      // Use custom format for LINE templates
      const sampleDate = new Date('2024-12-01T14:00:00');
      const sampleEndDate = new Date('2024-12-01T15:00:00');
      sampleSlot = template.formatFunction({ start: sampleDate, end: sampleEndDate }, language.code, 0);
    } else {
      sampleSlot = language.code === 'ja' 
        ? '12月1日(金) 14:00 - 15:00' 
        : 'Dec 1 (Fri) 14:00 - 15:00';
    }
    
    return `${beforeText}${beforeText ? '\n' : ''}${sampleSlot}${afterText}`;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Template Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FileText size={14} />
          <span>
            {language.code === 'ja' ? 'テンプレート' : 'Template'}: {templateName}
          </span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[45] bg-black/50 flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              {/* Dropdown - now as modal */}
              <div 
                className="bg-white rounded-lg shadow-lg border border-gray-200 z-[46] w-[320px] max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      {language.code === 'ja' ? 'コピーテンプレート選択' : 'Select Copy Template'}
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              
              <div className="max-h-[350px] overflow-y-auto p-2">
                {templates
                  .map(template => {
                    const isSelected = template.id === selectedTemplateId;
                    const name = language.code === 'ja' ? template.nameJa : template.nameEn;
                    
                    return (
                      <div key={template.id}>
                        <button
                          onClick={() => handleTemplateSelect(template.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-50 text-blue-700 border-2 border-blue-300 shadow-sm' 
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                                {name}
                              </span>
                              {template.isCustom && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                                  {language.code === 'ja' ? 'カスタム' : 'Custom'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {template.isCustom && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTemplate(template);
                                    setShowCustomModal(true);
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                              )}
                              <div className={`transition-all duration-200 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                <Check size={16} className="text-blue-600" />
                              </div>
                            </div>
                          </div>
                          {/* Mini preview */}
                          <div className={`text-xs mt-1 truncate ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                            {(language.code === 'ja' ? template.beforeTextJa : template.beforeTextEn).slice(0, 40)}
                            {(language.code === 'ja' ? template.beforeTextJa : template.beforeTextEn).length > 40 && '...'}
                          </div>
                        </button>
                      </div>
                    );
                  })}
              </div>

                <div className="p-2 border-t border-gray-100 space-y-2">
                  <button
                    onClick={() => {
                      setShowPreview(!showPreview);
                    }}
                    className="w-full text-xs text-blue-600 hover:text-blue-700 py-1"
                  >
                    {showPreview 
                      ? (language.code === 'ja' ? 'プレビューを隠す' : 'Hide Preview')
                      : (language.code === 'ja' ? 'プレビューを表示' : 'Show Preview')
                    }
                  </button>
                  <button
                    onClick={() => {
                      setEditingTemplate(null);
                      setShowCustomModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border-2 border-dashed border-blue-300 text-sm font-medium"
                  >
                    <Plus size={16} />
                    {language.code === 'ja' ? 'カスタムテンプレートを作成' : 'Create Custom Template'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">
                {language.code === 'ja' ? 'テンプレートプレビュー' : 'Template Preview'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {language.code === 'ja' ? selectedTemplate.nameJa : selectedTemplate.nameEn}
              </p>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm">
                {getPreviewText(selectedTemplate)}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {language.code === 'ja' ? '閉じる' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* カスタムテンプレートモーダル */}
      <CustomTemplateModal
        isOpen={showCustomModal}
        onClose={() => {
          setShowCustomModal(false);
          setEditingTemplate(null);
        }}
        language={language}
        editingTemplate={editingTemplate}
        onSave={() => {
          refreshTemplates();
        }}
      />
    </div>
  );
};

export default CopyTemplateSelector;