import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, FileText } from 'lucide-react';
import { Language } from '../types';
import { copyTemplates, CopyTemplate, getDefaultTemplate, saveSelectedTemplate } from '../constants/copyTemplates';

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

  useEffect(() => {
    const template = copyTemplates.find(t => t.id === selectedTemplateId);
    if (template) {
      onTemplateChange(template);
    }
  }, [selectedTemplateId, onTemplateChange]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    saveSelectedTemplate(templateId);
    setIsOpen(false);
  };

  const selectedTemplate = copyTemplates.find(t => t.id === selectedTemplateId);
  const templateName = language.code === 'ja' ? selectedTemplate?.nameJa : selectedTemplate?.nameEn;

  const getPreviewText = (template: CopyTemplate) => {
    const beforeText = language.code === 'ja' ? template.beforeTextJa : template.beforeTextEn;
    const afterText = language.code === 'ja' ? template.afterTextJa : template.afterTextEn;
    const sampleSlot = language.code === 'ja' 
      ? '12月1日(金) 14:00 - 15:00' 
      : 'Dec 1 (Fri) 14:00 - 15:00';
    
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
              className="fixed inset-0 z-[45]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-[46] w-[280px]">
              <div className="p-2 border-b border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2">
                  {language.code === 'ja' ? 'コピーテンプレート選択' : 'Select Copy Template'}
                </div>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto p-2">
                {copyTemplates.map(template => {
                  const isSelected = template.id === selectedTemplateId;
                  const name = language.code === 'ja' ? template.nameJa : template.nameEn;
                  
                  return (
                    <div key={template.id}>
                      <button
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{name}</span>
                          {isSelected && (
                            <Check size={14} className="text-blue-600" />
                          )}
                        </div>
                        {/* Mini preview */}
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {(language.code === 'ja' ? template.beforeTextJa : template.beforeTextEn).slice(0, 40)}
                          {(language.code === 'ja' ? template.beforeTextJa : template.beforeTextEn).length > 40 && '...'}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-2 border-t border-gray-100">
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
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
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
    </div>
  );
};

export default CopyTemplateSelector;