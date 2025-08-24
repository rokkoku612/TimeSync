import React, { useState, useCallback } from 'react';
import { Copy, X } from 'lucide-react';
import { ResultsListProps, TimeSlot } from '../types';
import CopyTemplateSelector from './CopyTemplateSelector';
import { CopyTemplate, copyTemplates, getDefaultTemplate } from '../constants/copyTemplates';

const ResultsList: React.FC<ResultsListProps> = ({ 
  availableSlots, 
  language, 
  copySuccess, 
  onDeleteSlot, 
  onCopyAll 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CopyTemplate>(() => {
    const defaultId = getDefaultTemplate();
    return copyTemplates.find(t => t.id === defaultId) || copyTemplates[0];
  });
  // Format time slot based on current language
  const formatTimeSlot = (slot: TimeSlot): string => {
    const date = new Date(slot.start);
    const endDate = new Date(slot.end);
    
    if (language.code === 'ja') {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      const dayOfWeek = days[date.getDay()];
      const startTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      return `${month}月${day}日(${dayOfWeek}) ${startTime} - ${endTime}`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const dayOfWeek = days[date.getDay()];
      const startTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      return `${month} ${day} (${dayOfWeek}) ${startTime} - ${endTime}`;
    }
  };

  const handleCopyWithTemplate = useCallback(() => {
    // This just triggers the success state now
    // The actual copying logic is handled here
    const slots = availableSlots.filter(slot => slot !== null);
    if (slots.length === 0) return;

    const beforeText = language.code === 'ja' ? selectedTemplate.beforeTextJa : selectedTemplate.beforeTextEn;
    const afterText = language.code === 'ja' ? selectedTemplate.afterTextJa : selectedTemplate.afterTextEn;
    
    const slotsText = slots
      .map(slot => formatTimeSlot(slot as TimeSlot))
      .join('\n');
    
    const fullText = `${beforeText}${beforeText ? '\n' : ''}${slotsText}${afterText}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      // Trigger the success animation
      if (typeof onCopyAll === 'function') {
        onCopyAll();
      }
    }).catch(() => {
      // Silently handle copy failure
    });
  }, [availableSlots, selectedTemplate, language, onCopyAll]);

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <span>{language.texts.availableSlots}</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyTemplateSelector 
            language={language}
            onTemplateChange={setSelectedTemplate}
          />
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copySuccess
                ? 'bg-slate-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
            onClick={handleCopyWithTemplate}
          >
            {copySuccess ? `${language.texts.copied}` : (
              <>
                <Copy size={14} className="inline mr-1" />
                {language.texts.copyAll}
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-0">
        {availableSlots.filter(slot => slot !== null).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {language.texts.noSlotsFound}
          </div>
        ) : (
          availableSlots.map((slot, index) => 
            slot && (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm text-slate-900 font-medium">{formatTimeSlot(slot)}</span>
                <button
                  className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => onDeleteSlot(index)}
                >
                  <X size={12} />
                </button>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default ResultsList;