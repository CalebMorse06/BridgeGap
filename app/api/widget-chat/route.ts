import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

/**
 * AI chat endpoint for embedded widget in generated apps.
 * Visitors can ask questions about the business and get instant answers.
 */
export async function POST(req: NextRequest) {
  try {
    const { question, businessContext } = await req.json()

    if (!question) {
      return NextResponse.json({ answer: "How can I help you?" })
    }

    if (!client) {
      // Fallback responses without API key
      const fallbacks: Record<string, string> = {
        hours: businessContext.hours || "Please call us for current hours.",
        book: "You can book directly on this page using the booking form above!",
        price: "Prices vary by service. Fill out the booking form and we'll give you a quote.",
        location: businessContext.location || "Contact us for our location.",
        contact: businessContext.email || "Use the contact form on this page.",
      }
      const lower = question.toLowerCase()
      for (const [key, val] of Object.entries(fallbacks)) {
        if (lower.includes(key)) return NextResponse.json({ answer: val })
      }
      return NextResponse.json({ answer: "Great question! Please use the form on this page or call us directly for the most accurate answer." })
    }

    const systemPrompt = `You are a helpful assistant for ${businessContext.name || 'this business'}. Answer visitor questions based on this business info:

Business: ${businessContext.name || 'N/A'}
Services: ${businessContext.services || 'N/A'}
Hours: ${businessContext.hours || 'N/A'}
Location: ${businessContext.location || 'N/A'}
Contact: ${businessContext.email || 'N/A'}

Rules:
- Keep answers SHORT (1-2 sentences max)
- Be warm and helpful
- If you don't know, say to call or use the contact form
- Never make up specific prices unless given
- Always encourage them to book/order if relevant`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 120,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
    })

    const answer = response.content[0].type === 'text' ? response.content[0].text : 'Please contact us for more info!'

    return NextResponse.json({ answer })
  } catch {
    return NextResponse.json({ answer: "I'm not sure — please use the contact form or call us directly!" })
  }
}
