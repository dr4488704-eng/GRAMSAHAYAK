import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { SEED_SCHEMES } from './src/data/seedSchemes.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

// In-memory data store for server session
let schemes = [...SEED_SCHEMES];
let profiles: Record<string, any> = {};
let applications: any[] = [];
let notifications: any[] = [
  {
    id: 'notif-demo-1',
    user_id: 'user-ramesh-01',
    scheme_id: 'ysr-rythu-bharosa-ap',
    type: 'new_matching_scheme',
    title: 'New Matching Scheme: YSR Rythu Bharosa',
    message: 'A state farmer assistance scheme matching your Andhra Pradesh location and 2-acre landholding was verified.',
    read: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif-demo-2',
    user_id: 'user-ramesh-01',
    scheme_id: 'pm-kisan',
    type: 'application_reminder',
    title: 'PM-KISAN e-KYC Reminder',
    message: 'Ensure your Aadhaar is linked to your active bank account for direct benefit transfer.',
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];
let notificationLogs: any[] = [
  {
    id: 'log-demo-1',
    user_id: 'user-ramesh-01',
    scheme_id: 'ysr-rythu-bharosa-ap',
    notification_type: 'new_matching_scheme',
    recipient_email: 'ramesh.farmer@gramsahay.gov.in',
    subject: 'GramSahay Alert: Potential match for YSR Rythu Bharosa',
    body_text: `Namaste Ramesh,\n\nBased on your registered profile in Andhra Pradesh with agricultural land, you may be eligible for YSR Rythu Bharosa (Benefit: ₹13,500 / year).\n\nMatched requirements:\n✓ Location matches Andhra Pradesh\n✓ Farmer occupation\n✓ Owns 2 acres of land\n\nTo apply, please visit your nearest Grama Sachivalayam or visit: https://ysrrythubharosa.ap.gov.in\n\nNotice: Final eligibility is determined exclusively by the respective government authority.`,
    html_preview: '<p>Notification preview</p>',
    delivery_channel: 'demo_mode',
    sent_at: new Date(Date.now() - 7200000).toISOString(),
    status: 'demo_preview'
  }
];

// Lazy Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    schemesCount: schemes.length,
    geminiAvailable: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Schemes Endpoints
app.get('/api/schemes', (req, res) => {
  res.json(schemes);
});

app.get('/api/schemes/:id', (req, res) => {
  const scheme = schemes.find(s => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }
  res.json(scheme);
});

app.post('/api/schemes', (req, res) => {
  const newScheme = req.body;
  if (!newScheme.id) {
    newScheme.id = 'scheme-' + Date.now();
  }
  schemes = [newScheme, ...schemes];
  res.status(201).json(newScheme);
});

app.put('/api/schemes/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;
  schemes = schemes.map(s => (s.id === id ? { ...s, ...updated } : s));
  res.json({ success: true, scheme: updated });
});

app.delete('/api/schemes/:id', (req, res) => {
  const { id } = req.params;
  schemes = schemes.filter(s => s.id !== id);
  res.json({ success: true, id });
});

// User Profile Sync
app.get('/api/profile/:id', (req, res) => {
  const prof = profiles[req.params.id];
  if (!prof) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(prof);
});

app.post('/api/profile', (req, res) => {
  const prof = req.body;
  if (prof && prof.id) {
    profiles[prof.id] = prof;
  }
  res.json({ success: true, profile: prof });
});

// Applications Management
app.get('/api/applications', (req, res) => {
  const userId = req.query.userId as string;
  if (userId) {
    return res.json(applications.filter(a => a.user_id === userId));
  }
  res.json(applications);
});

app.post('/api/applications', (req, res) => {
  const appData = req.body;
  const existingIdx = applications.findIndex(a => a.id === appData.id);
  if (existingIdx >= 0) {
    applications[existingIdx] = { ...applications[existingIdx], ...appData, updated_at: new Date().toISOString() };
    return res.json(applications[existingIdx]);
  } else {
    const newApp = {
      ...appData,
      id: appData.id || 'app-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    applications.push(newApp);
    return res.status(201).json(newApp);
  }
});

app.delete('/api/applications/:id', (req, res) => {
  applications = applications.filter(a => a.id !== req.params.id);
  res.json({ success: true });
});

// Notifications Endpoints
app.get('/api/notifications/:userId', (req, res) => {
  const userNotifs = notifications.filter(n => n.user_id === req.params.userId);
  res.json(userNotifs);
});

app.post('/api/notifications', (req, res) => {
  const { userId, notification, emailData } = req.body;
  
  if (notification) {
    notifications.unshift(notification);
  }

  let createdLog = null;
  if (emailData) {
    createdLog = {
      id: 'log-' + Date.now(),
      user_id: userId,
      scheme_id: notification?.scheme_id || '',
      notification_type: notification?.type || 'new_matching_scheme',
      recipient_email: emailData.recipient_email || 'citizen@gramsahay.gov.in',
      subject: emailData.subject || 'GramSahay Welfare Scheme Update',
      body_text: `Namaste ${emailData.recipient_name || 'Citizen'},\n\nBased on your registered profile, you may be eligible for ${emailData.scheme_name}${emailData.benefit_amount ? ` (${emailData.benefit_amount})` : ''}.\n\nWhy this matches:\n${emailData.matching_reason || 'Verified location and demographic criteria'}\n\nOfficial Portal:\n${emailData.application_url || 'https://india.gov.in'}\n\nNotice: Final eligibility is determined exclusively by the respective government authority.`,
      html_preview: `<div style="font-family: sans-serif; padding: 16px; border: 1px solid #ddd; border-radius: 8px;"><h3>GramSahay AI Notification</h3><p>Dear ${emailData.recipient_name},</p><p>You may be eligible for <strong>${emailData.scheme_name}</strong>.</p><p><em>Benefit:</em> ${emailData.benefit_amount || 'Government aid'}</p><p><strong>Matching Criteria:</strong> ${emailData.matching_reason}</p><p><a href="${emailData.application_url || 'https://india.gov.in'}">Visit Official Application Portal</a></p></div>`,
      delivery_channel: process.env.SMTP_USER ? 'smtp' : 'demo_mode',
      sent_at: new Date().toISOString(),
      status: process.env.SMTP_USER ? 'sent' : 'demo_preview'
    };
    notificationLogs.unshift(createdLog);
  }

  res.json({ success: true, notification, log: createdLog });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  res.json({ success: true });
});

app.put('/api/notifications/read-all', (req, res) => {
  const { userId } = req.body;
  notifications = notifications.map(n => n.user_id === userId ? { ...n, read: true } : n);
  res.json({ success: true });
});

app.get('/api/notifications/logs/all', (req, res) => {
  res.json(notificationLogs);
});

// Gemini-Powered Rural Scheme Assistant Endpoint
app.post('/api/assistant/query', async (req, res) => {
  try {
    const { query, language = 'en', profile } = req.body;

    const availableSchemesList = schemes.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      benefit: s.benefit_amount,
      min_age: s.min_age,
      max_age: s.max_age,
      states: s.states,
      gender: s.gender_requirement,
      requires_land: s.requires_land,
      documents: s.required_documents,
      official_source: s.official_source
    }));

    const ai = getAI();

    if (ai) {
      const systemInstruction = `You are GramSahay AI, an empathetic, respectful, and authoritative rural welfare schemes advisor in India.
Current User Language: ${language} (support English 'en', Telugu 'te', Tamil 'ta', Hindi 'hi').
Respond in the specified language (${language}) or matching the user's script.
Always ground your answers in the provided official schemes catalog. Never hallucinate fake schemes or eligibility guarantees.
Emphasize that final determination rests with the respective government authorities.
Cite required documents and official links when relevant.
Keep explanations concise, easy to comprehend for rural citizens, without complex bureaucratic jargon.

Catalog of verified official schemes:
${JSON.stringify(availableSchemesList, null, 2)}

User Profile (if available):
${profile ? JSON.stringify(profile, null, 2) : 'Anonymous Citizen'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });

      const replyText = response.text || 'I am ready to help you discover welfare schemes.';
      return res.json({ reply: replyText, grounded: true });
    } else {
      // Fallback rule-based answering if no API key is set
      const lower = (query || '').toLowerCase();
      const matched = schemes.filter(s => 
        lower.includes(s.name.toLowerCase()) || 
        lower.includes(s.category.toLowerCase()) ||
        s.category.toLowerCase().includes(lower)
      );

      let replyText = '';
      if (matched.length > 0) {
        const first = matched[0];
        replyText = `Found information for ${first.name}: ${first.short_description}. Key benefit: ${first.benefit_amount || 'Financial/material support'}. Required documents: ${first.required_documents.slice(0, 3).join(', ')}. You can apply via ${first.application_url || first.official_source}.`;
      } else {
        replyText = `Namaste. I found ${schemes.length} verified government welfare schemes across agriculture, housing, education, women welfare, and healthcare. Please specify your occupation or needed benefit to evaluate your criteria.`;
      }

      return res.json({ reply: replyText, grounded: true, fallback: true });
    }
  } catch (error: any) {
    console.error('Assistant error:', error);
    res.status(500).json({ error: 'Failed to process inquiry', details: error.message });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GramSahay AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
