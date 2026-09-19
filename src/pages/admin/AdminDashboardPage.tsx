import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Plus, 
  List, 
  Database, 
  Mail, 
  Send, 
  CheckCircle, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { checkEligibility } from '../../utils/eligibilityEngine';
import { EmailPreviewModal } from '../../components/EmailPreviewModal';
import { NotificationLog, Scheme } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { schemes, notificationLogs, profile, sendNotification } = useApp();
  const [copiedSql, setCopiedSql] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);
  const [previewLog, setPreviewLog] = useState<NotificationLog | null>(null);

  // Calculate statistics
  const totalSchemes = schemes.length;
  const centralSchemes = schemes.filter((s: Scheme) => s.states.includes('All')).length;
  const stateSchemes = totalSchemes - centralSchemes;
  const totalLogs = notificationLogs.length;

  const handleSimulateBroadcast = () => {
    // Pick the most recent scheme
    const targetScheme = schemes[0];
    let matchedCount = 0;

    // Evaluate across demo profiles + current profile
    const allUsers = [...DEMO_PROFILES, profile];
    allUsers.forEach(u => {
      const res = checkEligibility(u, targetScheme);
      if (res.status === 'POTENTIALLY_ELIGIBLE') {
        matchedCount++;
        sendNotification({
          type: 'new_matching_scheme',
          title: `Broadcast: New Scheme for ${u.occupation}`,
          message: `Dear ${u.name}, you may be eligible for "${targetScheme.name}".`,
          scheme_id: targetScheme.id,
          email_data: {
            recipient_email: u.email || 'citizen@gramsahay.gov.in',
            recipient_name: u.name,
            subject: `GramSahay Matching Alert: ${targetScheme.name}`,
            scheme_name: targetScheme.name,
            benefit_amount: targetScheme.benefit_amount,
            matching_reason: res.matchedCriteria.join('; '),
            application_url: targetScheme.application_url || targetScheme.official_source
          }
        });
      }
    });

    setBroadcastResult(`Broadcast completed: ${matchedCount} matching citizen profiles identified. Email & in-app alerts logged.`);
    setTimeout(() => setBroadcastResult(null), 6000);
  };

  const sqlSchemaCode = `-- GramSahay AI Supabase Schema
create table if not exists schemes (
  id text primary key,
  name text not null,
  category text not null,
  subcategory text,
  short_description text not null,
  full_description text not null,
  benefits text[] not null,
  benefit_amount text,
  min_age integer,
  max_age integer,
  gender_eligibility text default 'all',
  categories_eligible text[] default '{}',
  occupations text[] default '{}',
  states text[] default '{"All"}',
  requires_land boolean default false,
  minimum_land_area numeric,
  land_types text[] default '{}',
  max_income numeric,
  required_documents text[] not null,
  application_steps text[] not null,
  official_source text not null,
  application_url text,
  last_verified_date text not null,
  created_at timestamp with time zone default now()
);

create table if not exists user_applications (
  id text primary key,
  user_id text not null,
  scheme_id text references schemes(id),
  status text not null,
  applied_date text not null,
  reference_number text,
  notes text
);

create table if not exists notification_logs (
  id text primary key,
  recipient_email text not null,
  subject text not null,
  body_text text not null,
  delivery_channel text not null,
  sent_at text not null
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              Administrative Control
            </span>
            <span className="text-xs text-[#2d6a4f] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Scheme Repository
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Scheme Administration & Broadcaster
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Publish welfare schemes, audit deterministic matching rules, and inspect automated notification broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/schemes/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-lg hover:bg-[#2d6a4f] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Scheme</span>
          </Link>
          <Link
            to="/admin/schemes"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <List className="w-4 h-4" />
            <span>Manage All Schemes</span>
          </Link>
        </div>
      </div>

      {/* Broadcast Result Feedback */}
      {broadcastResult && (
        <div className="p-4 bg-[#d8f3dc] border border-[#b7e4c7] rounded-lg text-xs font-semibold text-[#1b4332] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#2d6a4f] shrink-0" />
          <span>{broadcastResult}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1">
          <div className="text-xs text-gray-500 font-medium">Total Schemes</div>
          <div className="text-2xl font-bold text-[#1b4332]">{totalSchemes}</div>
          <div className="text-[11px] text-gray-500">Verified gazette entries</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1">
          <div className="text-xs text-gray-500 font-medium">Central Schemes</div>
          <div className="text-2xl font-bold text-gray-800">{centralSchemes}</div>
          <div className="text-[11px] text-gray-500">Pan-India applicability</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1">
          <div className="text-xs text-gray-500 font-medium">State Schemes</div>
          <div className="text-2xl font-bold text-gray-800">{stateSchemes}</div>
          <div className="text-[11px] text-gray-500">AP, TN, TS, UP, etc.</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1">
          <div className="text-xs text-gray-500 font-medium">Email Alerts Logged</div>
          <div className="text-2xl font-bold text-gray-800">{totalLogs}</div>
          <div className="text-[11px] text-gray-500">Demo mode / SMTP logs</div>
        </div>
      </div>

      {/* Evaluation Quick Actions (Section 36 & 37) */}
      <div className="bg-[#fcfbf9] rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1b4332] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2d6a4f]" />
              <span>Automated Eligibility Broadcast Simulation</span>
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Simulate publishing an update to trigger automated rule-matching across all active citizen personas.
            </p>
          </div>

          <button
            onClick={handleSimulateBroadcast}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded shadow-xs transition-colors self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Run Broadcast Test</span>
          </button>
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <div>• Evaluates all verified constraints (Age, Land, State, Occupation, Income) deterministically.</div>
          <div>• Immediately logs email artifact for demo verification in Demo Email Mode.</div>
          <div>• Dispatches in-app notification to matching citizen profiles.</div>
        </div>
      </div>

      {/* Recent Notification Logs Table with Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2d6a4f]" />
              <span>Broadcast Inspection (Demo Email Mode)</span>
            </h3>
            <p className="text-xs text-gray-500">
              Evaluators can view the exact email template delivered to citizens.
            </p>
          </div>
          <Link to="/notifications" className="text-xs font-semibold text-[#1b4332] hover:underline">
            View All Alerts →
          </Link>
        </div>

        {notificationLogs.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded border border-gray-200 text-center text-xs text-gray-500">
            No notification logs yet. Click "Run Broadcast Test" above to generate a live log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Recipient</th>
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5">Channel</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notificationLogs.slice(0, 5).map((log: NotificationLog) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="p-2.5 text-gray-500 whitespace-nowrap">
                      {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-2.5 font-mono text-gray-800">{log.recipient_email}</td>
                    <td className="p-2.5 font-medium text-gray-900">{log.subject}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f3f0ea] text-[#1b4332] uppercase">
                        {log.delivery_channel}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setPreviewLog(log)}
                        className="px-2.5 py-1 bg-white border border-gray-300 hover:border-[#2d6a4f] rounded text-[11px] font-semibold text-[#1b4332]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Supabase Schema Reference Box */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#2d6a4f]" />
            <h3 className="text-sm font-bold text-gray-900">Database Schema (PostgreSQL / Supabase)</h3>
          </div>
          <button
            onClick={copySql}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded transition-colors"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-[#2d6a4f]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copied SQL' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <p className="text-xs text-gray-600">
          When external Supabase credentials are configured in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">.env</code>, these production relational tables manage verified schemes, applications, and logs automatically.
        </p>

        <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-56">
          {sqlSchemaCode}
        </pre>
      </div>

      {/* Email Preview Modal */}
      <EmailPreviewModal
        log={previewLog}
        onClose={() => setPreviewLog(null)}
      />

    </div>
  );
};
