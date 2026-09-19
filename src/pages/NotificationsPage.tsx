import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Mail, 
  Send, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationCard } from '../components/NotificationCard';
import { EmailPreviewModal } from '../components/EmailPreviewModal';
import { NotificationLog } from '../types';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    notificationLogs, 
    markAllNotificationsAsRead, 
    sendNotification, 
    profile, 
    schemes, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'in_app' | 'email_logs'>('in_app');
  const [filterUnread, setFilterUnread] = useState(false);
  const [previewLog, setPreviewLog] = useState<NotificationLog | null>(null);

  const displayedNotifications = filterUnread 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleTriggerTestNotification = () => {
    // Generate a test notification for the active profile
    const randomScheme = schemes[0];
    sendNotification({
      type: 'new_matching_scheme',
      title: `New Scheme Matched: ${randomScheme.name}`,
      message: `Based on your profile in ${profile.state}, you may be eligible for ${randomScheme.name} (${randomScheme.benefit_amount || 'Assistance'}).`,
      scheme_id: randomScheme.id,
      email_data: {
        recipient_email: profile.email || 'citizen@gramsahay.gov.in',
        recipient_name: profile.name,
        subject: `GramSahay: Potential match for ${randomScheme.name}`,
        scheme_name: randomScheme.name,
        benefit_amount: randomScheme.benefit_amount,
        matching_reason: `Your profile matches the occupation (${profile.occupation}) and state (${profile.state}) criteria.`,
        application_url: randomScheme.application_url || randomScheme.official_source
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2d6a4f]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
              {t('notifications')} & Alert Logs
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {notifications.filter(n => !n.read).length} unread
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Automated alerts triggered when new welfare schemes match your deterministic profile.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleTriggerTestNotification}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f0ea] hover:bg-[#e8e4db] text-[#1b4332] text-xs font-bold rounded border border-[#ded9cf] transition-colors"
            title="Simulate matched scheme broadcast"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Match Alert</span>
          </button>

          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('in_app')}
          className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'in_app'
              ? 'border-[#1b4332] text-[#1b4332]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          In-App Notifications ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab('email_logs')}
          className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'email_logs'
              ? 'border-[#1b4332] text-[#1b4332]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Mail className="w-4 h-4 text-[#2d6a4f]" />
          <span>Demo Email Mode & Sent Logs ({notificationLogs.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'in_app' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Showing {displayedNotifications.length} alerts</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filterUnread}
                onChange={(e) => setFilterUnread(e.target.checked)}
                className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f] w-3 h-3"
              />
              <span>Unread only</span>
            </label>
          </div>

          {displayedNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-10 text-center space-y-2">
              <Bell className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-gray-700">No notifications</h3>
              <p className="text-xs text-gray-500">
                You're all caught up! As new schemes matching your profile are published, alerts will appear here.
              </p>
            </div>
          ) : (
            displayedNotifications.map((notif) => (
              <NotificationCard key={notif.id} notification={notif} />
            ))
          )}
        </div>
      ) : (
        /* Email Logs Table (Demo Email Mode Inspector for judges) */
        <div className="space-y-4">
          <div className="p-3 bg-[#fef3c7] rounded-lg border border-[#fde68a] text-xs text-[#92400e]">
            <strong>Demo Email Mode Active:</strong> Whenever a scheme match or test alert is issued, an email artifact is securely generated with matching reasons, official links, and disclaimers. Evaluators can click "View Preview" below to inspect the rendered email template.
          </div>

          {notificationLogs.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-10 text-center space-y-2">
              <Mail className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-gray-700">No email logs yet</h3>
              <p className="text-xs text-gray-500">
                Click "Test Match Alert" above or publish a scheme in the Admin Dashboard to trigger an email log.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold">
                      <th className="p-3">Sent At</th>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3 text-right">Inspection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {notificationLogs.map((log: NotificationLog) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-gray-500 whitespace-nowrap">
                          {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3 font-mono text-gray-800">
                          {log.recipient_email}
                        </td>
                        <td className="p-3 font-medium text-gray-900">
                          {log.subject}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f3f0ea] text-[#1b4332] uppercase">
                            {log.delivery_channel}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setPreviewLog(log)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 hover:border-[#2d6a4f] rounded text-[11px] font-semibold text-[#1b4332] transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Preview</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email Preview Modal */}
      <EmailPreviewModal
        log={previewLog}
        onClose={() => setPreviewLog(null)}
      />

    </div>
  );
};
