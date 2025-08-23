import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Language } from '../types';
import googleCalendar from '../services/googleCalendar';

interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  language: Language;
  onEventUpdated: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  language,
  onEventUpdated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setLocation(event.location || '');
      
      const startDateTime = new Date(event.start);
      const endDateTime = new Date(event.end);
      
      setStartDate(startDateTime.toISOString().split('T')[0]);
      setStartTime(startDateTime.toTimeString().substring(0, 5));
      setEndDate(endDateTime.toISOString().split('T')[0]);
      setEndTime(endDateTime.toTimeString().substring(0, 5));
    } else {
      // New event - set defaults
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate(now.toISOString().split('T')[0]);
      setStartTime(now.toTimeString().substring(0, 5));
      setEndDate(nextHour.toISOString().split('T')[0]);
      setEndTime(nextHour.toTimeString().substring(0, 5));
    }
    setError(null);
  }, [event, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError(language.code === 'ja' ? 'タイトルは必須です' : 'Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      if (endDateTime <= startDateTime) {
        setError(language.code === 'ja' ? '終了時刻は開始時刻より後である必要があります' : 'End time must be after start time');
        return;
      }

      const eventData = {
        title: title.trim(),
        start: startDateTime,
        end: endDateTime,
        description: description.trim() || undefined,
        location: location.trim() || undefined
      };

      if (event?.id) {
        // Update existing event
        await googleCalendar.updateEvent(event.id, eventData);
      } else {
        // Create new event
        await googleCalendar.createEvent(eventData);
      }

      onEventUpdated();
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;

    if (!confirm(language.code === 'ja' ? 'この予定を削除しますか？' : 'Are you sure you want to delete this event?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await googleCalendar.deleteEvent(event.id);
      onEventUpdated();
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            {event?.id 
              ? (language.code === 'ja' ? '予定の編集' : 'Edit Event')
              : (language.code === 'ja' ? '新しい予定' : 'New Event')
            }
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language.code === 'ja' ? 'タイトル *' : 'Title *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={language.code === 'ja' ? '予定のタイトルを入力' : 'Enter event title'}
              disabled={loading}
            />
          </div>

          {/* Start Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language.code === 'ja' ? '開始' : 'Start'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language.code === 'ja' ? '終了' : 'End'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language.code === 'ja' ? '場所' : 'Location'}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={language.code === 'ja' ? '場所を入力（オプション）' : 'Enter location (optional)'}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language.code === 'ja' ? '説明' : 'Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder={language.code === 'ja' ? '説明を入力（オプション）' : 'Enter description (optional)'}
              disabled={loading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          {event?.id && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              {language.code === 'ja' ? '削除' : 'Delete'}
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {language.code === 'ja' ? 'キャンセル' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim()}
            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {language.code === 'ja' ? '保存' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;