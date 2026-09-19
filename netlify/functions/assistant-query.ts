import {GoogleGenAI} from '@google/genai';
import {SEED_SCHEMES} from '../../src/data/seedSchemes';

type RequestBody = {
  query?: string;
  language?: string;
  profile?: unknown;
};

const fallbackReply = (query: string): string => {
  const lower = query.toLowerCase();

  if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('రైతు') || lower.includes('किसान') || lower.includes('விவசாயி')) {
    return 'For farmers with landholdings, key verified schemes include PM-KISAN, PM Kisan Maandhan, and state farmer assistance schemes. Common documents are Aadhaar, land records, and an Aadhaar-linked bank account. Verify final eligibility with the official government department.';
  }

  if (lower.includes('document') || lower.includes('పత్రాలు') || lower.includes('दस्तावेज') || lower.includes('ஆவணங்கள்')) {
    return 'Common documents include Aadhaar, an active bank passbook, income or ration-card records, land records where required, and passport-size photographs. Requirements differ by scheme, so verify them on the official portal.';
  }

  return `GramSahay found ${SEED_SCHEMES.length} verified welfare schemes. Please mention your occupation, state, or the benefit you need so I can identify relevant schemes.`;
};

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const body = await request.json() as RequestBody;
  const query = body.query?.trim();
  if (!query) {
    return new Response(JSON.stringify({error: 'Query is required'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({reply: fallbackReply(query), grounded: true, fallback: true}), {
      headers: {'Content-Type': 'application/json'},
    });
  }

  try {
    const ai = new GoogleGenAI({apiKey});
    const catalog = SEED_SCHEMES.map(scheme => ({
      id: scheme.id,
      name: scheme.name,
      category: scheme.category,
      benefit: scheme.benefit_amount,
      states: scheme.states,
      documents: scheme.required_documents,
      official_source: scheme.official_source,
    }));
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: `You are GramSahay AI, a concise and empathetic Indian government welfare scheme advisor. Answer in ${body.language || 'en'}. Only use this verified catalog and never promise eligibility. Remind users that final eligibility is decided by the government department. Catalog: ${JSON.stringify(catalog)}. User profile: ${JSON.stringify(body.profile || {})}`,
        temperature: 0.3,
      },
    });

    return new Response(JSON.stringify({reply: response.text || fallbackReply(query), grounded: true}), {
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('Netlify assistant error:', error);
    return new Response(JSON.stringify({reply: fallbackReply(query), grounded: true, fallback: true}), {
      headers: {'Content-Type': 'application/json'},
    });
  }
};
