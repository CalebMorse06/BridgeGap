import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a warm, encouraging assistant helping non-technical business owners build their first web app.

TONE RULES (critical):
- Use simple, friendly language. Never use technical jargon.
- NEVER say: database, API, deploy, code, server, backend, frontend, framework, hosting, infrastructure
- INSTEAD say: "setting up your booking system", "making it easy for customers to find you", "building that feature", "getting you online"
- Keep responses SHORT — one question at a time, max 2-3 sentences
- Be encouraging: celebrate what they share ("That sounds great!", "Perfect!", "Love that!")
- Sound like a helpful friend, not a robot or software company

Your job is to collect the information needed to build their app through friendly conversation.`

export async function POST(req: NextRequest) {
  try {
    const { message, history, template, step } = await req.json()

    const messages = [
      ...(history || []).slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === 'ai' ? 'assistant' : 'user' as 'assistant' | 'user',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}
