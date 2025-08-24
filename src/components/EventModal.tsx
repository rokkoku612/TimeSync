import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, UserPlus, Mail, Video } from 'lucide-react';
import { Language } from '../types';
import googleCalendar from '../services/googleCalendar';

interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  calendarId?: string;
  calendarName?: string;
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
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>(['primary']);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendeeInput, setAttendeeInput] = useState('');
  const [sendNotifications, setSendNotifications] = useState(true);
  const [addGoogleMeet, setAddGoogleMeet] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setLocation(event.location || '');
      setSelectedCalendarIds(event.calendarId ? [event.calendarId] : ['primary']);
      setIsNewEvent(!event.id);
      setAttendees([]);
      setAttendeeInput('');
      setSendNotifications(true);
      setAddGoogleMeet(false);
      
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
      setSelectedCalendarIds(['primary']);
      setIsNewEvent(true);
      setAttendees([]);
      setAttendeeInput('');
      setSendNotifications(true);
      setAddGoogleMeet(false);
      setStartDate(now.toISOString().split('T')[0]);
      setStartTime(now.toTimeString().substring(0, 5));
      setEndDate(nextHour.toISOString().split('T')[0]);
      setEndTime(nextHour.toTimeString().substring(0, 5));
    }
    setError(null);
  }, [event, isOpen]);

  // Load calendar list
  useEffect(() => {
    if (isOpen) {
      loadCalendars();
    }
  }, [isOpen]);

  const loadCalendars = async () => {
    try {
      const calendarList = await googleCalendar.getCalendarList();
      // Filter for calendars where user has write access
      const writableCalendars = calendarList.filter((cal: any) => 
        cal.accessRole === 'owner' || cal.accessRole === 'writer'
      );
      setCalendars(writableCalendars);
    } catch (error) {
      setCalendars([]);
    }
  };

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

      if (event?.id) {
        // Update existing event (single calendar only)
        const eventData = {
          title: title.trim(),
          start: startDateTime,
          end: endDateTime,
          description: description.trim() || undefined,
          location: location.trim() || undefined,
          calendarId: event.calendarId,
          attendees: attendees.length > 0 ? attendees : undefined,
          sendNotifications,
          addGoogleMeet
        };
        await googleCalendar.updateEvent(event.id, eventData);
      } else {
        // Create new event (can be in multiple calendars)
        if (selectedCalendarIds.length === 0) {
          setError(language.code === 'ja' ? 'カレンダーを選択してください' : 'Please select at least one calendar');
          return;
        }

        if (selectedCalendarIds.length === 1) {
          // Single calendar
          const eventData = {
            title: title.trim(),
            start: startDateTime,
            end: endDateTime,
            description: description.trim() || undefined,
            location: location.trim() || undefined,
            calendarId: selectedCalendarIds[0],
            attendees: attendees.length > 0 ? attendees : undefined,
            sendNotifications,
            addGoogleMeet
          };
          await googleCalendar.createEvent(eventData);
        } else {
          // Multiple calendars
          const eventData = {
            title: title.trim(),
            start: startDateTime,
            end: endDateTime,
            description: description.trim() || undefined,
            location: location.trim() || undefined,
            calendarIds: selectedCalendarIds,
            attendees: attendees.length > 0 ? attendees : undefined,
            sendNotifications,
            addGoogleMeet
          };
          await googleCalendar.createEventInMultipleCalendars(eventData);
        }
      }

      onEventUpdated();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save event');
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
      await googleCalendar.deleteEvent(event.id, event.calendarId);
      onEventUpdated();
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const addAttendee = () => {
    const email = attendeeInput.trim();
    if (email && !attendees.includes(email)) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        setAttendees([...attendees, email]);
        setAttendeeInput('');
      } else {
        setError(language.code === 'ja' ? '正しいメールアドレスを入力してください' : 'Please enter a valid email address');
      }
    }
  };

  const removeAttendee = (email: string) => {
    setAttendees(attendees.filter(a => a !== email));
  };

  const handleAttendeeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAttendee();
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
          {/* Calendar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language.code === 'ja' ? 'カレンダー' : 'Calendar'}
              {isNewEvent && !event?.id && (
                <span className="ml-2 text-xs text-gray-500">
                  {language.code === 'ja' ? '(複数選択可)' : '(Multiple selection available)'}
                </span>
              )}
            </label>
            {event?.id ? (
              // Existing event - show single calendar
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm">
                  {event.calendarName || (language.code === 'ja' ? 'メインカレンダー' : 'Primary Calendar')}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {language.code === 'ja' 
                    ? '既存の予定のカレンダーは変更できません' 
                    : 'Cannot change calendar for existing events'}
                </p>
              </div>
            ) : (
              // New event - show multiple selection checkboxes
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="calendar-primary"
                    value="primary"
                    checked={selectedCalendarIds.includes('primary')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCalendarIds([...selectedCalendarIds, 'primary']);
                      } else {
                        setSelectedCalendarIds(selectedCalendarIds.filter(id => id !== 'primary'));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <label htmlFor="calendar-primary" className="ml-2 text-sm text-gray-700 cursor-pointer flex-1">
                    {language.code === 'ja' ? 'メインカレンダー' : 'Primary Calendar'}
                  </label>
                </div>
                {calendars.filter(cal => !cal.primary).map((calendar) => (
                  <div key={calendar.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`calendar-${calendar.id}`}
                      value={calendar.id}
                      checked={selectedCalendarIds.includes(calendar.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCalendarIds([...selectedCalendarIds, calendar.id]);
                        } else {
                          setSelectedCalendarIds(selectedCalendarIds.filter(id => id !== calendar.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      disabled={loading}
                    />
                    <label 
                      htmlFor={`calendar-${calendar.id}`} 
                      className="ml-2 text-sm text-gray-700 cursor-pointer flex-1 flex items-center gap-2"
                    >
                      {calendar.backgroundColor && (
                        <span 
                          className="w-3 h-3 rounded-full border border-gray-300" 
                          style={{ backgroundColor: calendar.backgroundColor }}
                        />
                      )}
                      {calendar.summary}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {!event?.id && selectedCalendarIds.length > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {language.code === 'ja' 
                  ? `${selectedCalendarIds.length}件のカレンダーが選択されています` 
                  : `${selectedCalendarIds.length} calendar(s) selected`}
              </p>
            )}
          </div>

          {/* Attendees / Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <UserPlus size={14} className="inline mr-1" />
              {language.code === 'ja' ? 'ゲストを招待' : 'Invite Guests'}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                onKeyPress={handleAttendeeKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language.code === 'ja' ? 'メールアドレスを入力' : 'Enter email address'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={addAttendee}
                disabled={loading || !attendeeInput.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {language.code === 'ja' ? '追加' : 'Add'}
              </button>
            </div>
            
            {/* List of added attendees */}
            {attendees.length > 0 && (
              <div className="space-y-1 mb-2">
                {attendees.map((email) => (
                  <div key={email} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-700">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttendee(email)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Send notifications checkbox */}
            {attendees.length > 0 && (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="send-notifications"
                  checked={sendNotifications}
                  onChange={(e) => setSendNotifications(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <label htmlFor="send-notifications" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  {language.code === 'ja' ? '招待メールを送信する' : 'Send invitation emails'}
                </label>
              </div>
            )}
            
            {attendees.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {language.code === 'ja' 
                  ? `${attendees.length}名のゲストが招待されます` 
                  : `${attendees.length} guest(s) will be invited`}
              </p>
            )}
          </div>

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

          {/* Google Meet Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Video size={20} className="text-gray-600" />
              <div>
                <label htmlFor="google-meet" className="text-sm font-medium text-gray-700 cursor-pointer">
                  {language.code === 'ja' ? 'Google Meetを追加' : 'Add Google Meet'}
                </label>
                <p className="text-xs text-gray-500">
                  {language.code === 'ja' 
                    ? 'ビデオ会議リンクを自動生成' 
                    : 'Auto-generate video conference link'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setAddGoogleMeet(!addGoogleMeet)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  addGoogleMeet ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                disabled={loading}
                role="switch"
                aria-checked={addGoogleMeet}
              >
                <span className="sr-only">
                  {language.code === 'ja' ? 'Google Meetを追加' : 'Add Google Meet'}
                </span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    addGoogleMeet ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
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
              disabled={loading || addGoogleMeet}
            />
            {addGoogleMeet && (
              <p className="text-xs text-blue-600 mt-1">
                {language.code === 'ja' 
                  ? 'Google Meetが設定されています' 
                  : 'Google Meet will be added'}
              </p>
            )}
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