// Replace with your actual Anthropic API key
// In production, proxy this through a backend server to keep your key safe
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

const SYSTEM_PROMPTS = {
  general: `You are Tena AI, a warm, practical personal assistant for a busy working mom. 
You help with all areas of life: career, parenting, relationships, home management, wellness, and finances. 
Be concise, supportive, and actionable. Keep responses to 2-4 sentences unless asked for more detail.
Use a friendly, peer-to-peer tone — like talking to a very capable friend.`,

  work: `You are Tena AI in Work Mode. You're a no-nonsense professional coach for a busy working mom.
Help with emails, meeting prep, career decisions, managing difficult colleagues, and work-life boundaries.
Be efficient, direct, and empowering. 2-4 sentences max unless the task requires more.`,

  family: `You are Tena AI in Family Mode. You're a warm, experienced family advisor.
Help with parenting challenges, kid activities, family scheduling, partner dynamics, and school stuff.
Be warm, practical, and non-judgmental. 2-4 sentences unless the task requires more.`,

  wellness: `You are Tena AI in Wellness Mode. You're a gentle, realistic wellness coach who GETS that time is limited.
Only suggest things that take under 15 minutes. Help with stress, sleep, movement, mental health, and energy.
Be encouraging, brief, and realistic — no toxic positivity. 2-4 sentences max.`,

  finance: `You are Tena AI in Finance Mode. You're a clear, judgment-free financial guide for a working mom.
Help with budgeting, saving strategies, childcare costs, insurance, and financial planning.
Be practical, specific, and empowering. 2-4 sentences unless numbers require more detail.`,
}

export async function sendMessage(messages, mode = 'general') {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || 'API request failed')
  }

  const data = await response.json()
  return data.content.map(c => c.text || '').join('')
}
