import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Sparkles, Check, ArrowRight, Clock } from 'lucide-react';
import { AppNotification } from '../types';
import { useApp } from '../context/AppContext';

interface NotificationCardProps {
  notification: AppNotification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const { markNotificationAsRead } = useApp();

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        notification.read
          ? 'bg-white border-gray-200 text-gray-700'
          : 'bg-[#fcfbf9] border-[#b7e4c7] shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              notification.read
                ? 'bg-gray-100 text-gray-500'
                : 'bg-[#d8f3dc] text-[#1b4332]'
            }`}
          >
            {notification.type === 'new_matching_scheme' ? (
              <Sparkles className="w-4 h-4 text-[#2d6a4f]" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                {notification.title}
              </h4>
              {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-[#2d6a4f]" />
              )}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {notification.message}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(notification.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {notification.scheme_id && (
            <Link
              to={`/schemes/${notification.scheme_id}`}
              onClick={() => markNotificationAsRead(notification.id)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b4332] hover:underline"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          {!notification.read && (
            <button
              onClick={() => markNotificationAsRead(notification.id)}
              className="text-[11px] text-gray-500 hover:text-gray-800 p-1"
              title="Mark as read"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
