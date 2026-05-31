/* ─── AI Integration Service ───
 * Provides AI-powered features across the ERP.
 * All features require an API key configured via the WebManage panel.
 * API keys are stored in localStorage – NEVER committed to source code.
 *
 * Supported providers: OpenAI, Google Gemini, Anthropic Claude, Custom
 */

import type { AIConfig, AIFeature, AIAnalysis } from '../types';

const AI_CONFIG_KEY = 'bbps-ai-config';

/* ─── LocalStorage helpers ─── */

export function getAIConfig(): AIConfig | null {
  try {
    const raw = localStorage.getItem(AI_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
}

export function clearAIConfig(): void {
  localStorage.removeItem(AI_CONFIG_KEY);
}

/* Check if AI feature is available (API key + feature enabled) */
export function isAIFeatureEnabled(feature: AIFeature): boolean {
  const config = getAIConfig();
  if (!config || !config.apiKey) return false;
  return config.enabledFeatures.includes(feature);
}

/* Returns which features are currently available */
export function getAvailableFeatures(): AIFeature[] {
  const config = getAIConfig();
  if (!config || !config.apiKey) return [];
  return config.enabledFeatures;
}

/* ─── Generic AI Call ───
 * Makes a request to the configured AI provider's API.
 * Falls back to mock responses when no API key is configured.
 */

async function callAI(prompt: string, context?: string): Promise<string> {
  const config = getAIConfig();

  /* No API key → return mock response */
  if (!config || !config.apiKey) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAIResponse(prompt);
  }

  /* API key present → attempt real API call */
  try {
    const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
    const model = config.model || 'gpt-3.5-turbo';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: `You are an AI assistant for a school ERP system. ${context || ''}` },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error(`AI API error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response from AI.';
  } catch (error) {
    console.warn('AI call failed, falling back to mock:', error);
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAIResponse(prompt);
  }
}

/* ─── Mock AI for offline/demo mode ─── */
function mockAIResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('grade') || lower.includes('score'))
    return 'Based on the submission, I would assign a score of 85/100. The student demonstrates good understanding but could improve on structured explanations. Suggestions: 1) Use more examples 2) Show step-by-step working 3) Include diagrams where possible.';

  if (lower.includes('lesson') || lower.includes('plan'))
    return 'Recommended lesson structure: 1) Warm-up (5 min) - Review previous concepts 2) Introduction (10 min) - Present new topic with real-world examples 3) Guided Practice (15 min) - Work through examples together 4) Independent Practice (15 min) - Students apply concepts 5) Assessment (5 min) - Quick quiz to check understanding.';

  if (lower.includes('analytics') || lower.includes('insight'))
    return 'Analysis complete: Class average is improving by 12% this term. Key recommendation: Focus on problem-solving skills. Three students (roll no. 12, 18, 24) need additional support in mathematics.';

  if (lower.includes('search'))
    return 'AI-powered search results: Found 5 relevant resources matching your query. Top result: "Advanced Mathematics - Chapter 4" with 89% relevance score.';

  if (lower.includes('recommend'))
    return 'Based on student performance, I recommend: 1) Practice worksheets on fractions 2) Khan Academy video series "Math Fundamentals" 3) Chapter 5 from the reference book for advanced practice.';

  return 'AI analysis complete. The system has processed your request and generated insights based on the available data. Check the detailed report for more information.';
}

/* ─── AI Feature Functions ─── */

export async function getAIAssistantResponse(userMessage: string, context?: string): Promise<string> {
  return callAI(userMessage, `You are a helpful school ERP assistant. ${context || ''}`);
}

export async function getGradingSuggestion(submissionContent: string, maxScore: number): Promise<AIAnalysis> {
  const response = await callAI(
    `Grade this student submission (max ${maxScore} points):\n${submissionContent}`,
    'You are a teacher grading student work. Provide score and feedback.'
  );
  return {
    summary: response,
    confidence: 0.75,
    suggestions: ['Review the submission for plagiarism', 'Check for completeness', 'Verify against rubric'],
    generatedAt: new Date().toISOString(),
  };
}

export async function getContentRecommendations(studentId: string, subject: string): Promise<string[]> {
  const response = await callAI(
    `Recommend learning resources for student ${studentId} in ${subject}`,
    'You are an educational content curator.'
  );
  return response.split('\n').filter(Boolean);
}

export async function getAnalyticsInsights(data: Record<string, unknown>): Promise<AIAnalysis> {
  const response = await callAI(
    `Analyze this academic data and provide insights:\n${JSON.stringify(data, null, 2)}`,
    'You are a data analyst for a school. Identify trends, risks, and opportunities.'
  );
  return {
    summary: response,
    confidence: 0.8,
    suggestions: ['Schedule parent-teacher meetings for at-risk students', 'Create advanced assignments for top performers'],
    generatedAt: new Date().toISOString(),
  };
}

export async function getSmartSearchResults(query: string, dataset: string): Promise<string[]> {
  const response = await callAI(
    `Search in ${dataset} for: "${query}". Return the top 5 most relevant results.`,
    'You are a smart search engine for educational content.'
  );
  return response.split('\n').filter(Boolean);
}

export async function getLessonPlanSuggestion(topic: string, grade: number, duration: number): Promise<string> {
  return callAI(
    `Create a ${duration}-minute lesson plan for grade ${grade} on topic: "${topic}"`,
    'You are an experienced curriculum designer.'
  );
}
