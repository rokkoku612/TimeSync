import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpTooltipProps {
  title: string;
  content: string;
  className?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ title, content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center"
        aria-label="Help"
      >
        <HelpCircle size={12} />
      </button>

      {isOpen && (
        <>
          {/* Mobile: Modal style */}
          <div className="md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[9998] bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Centered tooltip */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm animate-fadeIn">
                {/* Content */}
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {content}
                </p>
              </div>
            </div>
          </div>
          
          {/* Desktop: Original tooltip style */}
          <div className="hidden md:block">
            <div className="absolute z-[9999] -top-2 left-6 animate-fadeIn">
              <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 md:w-80">
                {/* Arrow */}
                <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
                <div className="absolute -left-2.5 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-gray-200 border-b-8 border-b-transparent" />
                
                {/* Content */}
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {content}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HelpTooltip;