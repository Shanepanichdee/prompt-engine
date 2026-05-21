/**
 * Unified AI client — switch providers with AI_PROVIDER in .env
 *
 * Supported: openai | anthropic | gemini | github
 *
 * Usage:
 *   import { chat, PROVIDER, DEFAULT_MODEL, logProvider } from '../client.js'
 *   const reply = await chat({ systemPrompt, userMessage })
 */

import OpenAI from 'openai'

export const PROVIDER = (process.env.AI_PROVIDER || 'openai').toLowerCase()

const DEFAULTS = {
  openai:    'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-20241022',
  gemini:    'gemini-1.5-flash',
  github:    'gpt-4o-mini',
}

export const DEFAULT_MODEL = DEFAULTS[PROVIDER] ?? 'gpt-4o-mini'

// Returns an OpenAI-compatible client (works for openai, gemini, github)
// Gemini and GitHub Models both speak the OpenAI API format — no separate SDK needed.
function openAICompatibleClient() {
  if (PROVIDER === 'openai') {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  if (PROVIDER === 'gemini') {
    return new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })
  }
  if (PROVIDER === 'github') {
    // GitHub Models: free, runs OpenAI + Llama + Mistral + more
    return new OpenAI({
      apiKey: process.env.GITHUB_TOKEN,
      baseURL: 'https://models.inference.ai.azure.com',
    })
  }
  return null
}

/**
 * Simple one-shot chat: system prompt + one user message → text response.
 * Works with ALL providers including Anthropic (which has a different SDK).
 */
export async function chat({ systemPrompt, userMessage, model }) {
  const m = model || DEFAULT_MODEL

  if (PROVIDER === 'anthropic') {
    // Anthropic uses a different SDK and API structure.
    // System prompt is a top-level field, not part of the messages array.
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const res = await client.messages.create({
      model: m,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
    return res.content[0].text
  }

  // OpenAI, Gemini, GitHub Models — all use the same OpenAI-compatible format
  const client = openAICompatibleClient()
  const res = await client.chat.completions.create({
    model: m,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  })
  return res.choices[0].message.content
}

/**
 * Returns an OpenAI-compatible client for use cases that need the raw client
 * (e.g. tool use, streaming). Throws a clear error if the provider is Anthropic
 * since that requires different handling.
 */
export function getOpenAICompatibleClient() {
  const client = openAICompatibleClient()
  if (!client) {
    throw new Error(
      `Provider "${PROVIDER}" does not use the OpenAI-compatible API.\n` +
      'Tool use with Anthropic requires different code (see README).\n' +
      'Switch to: AI_PROVIDER=openai, gemini, or github'
    )
  }
  return client
}

export function logProvider() {
  const icons = { openai: '🟢', anthropic: '🟠', gemini: '🔵', github: '⚫' }
  const icon = icons[PROVIDER] ?? '⚪'
  console.log(`${icon} Provider: ${PROVIDER} | Model: ${DEFAULT_MODEL}`)
}
