import { NextRequest, NextResponse } from 'next/server'

/**
 * Creates a Stripe Payment Link for a deposit/booking payment.
 * Falls back to a demo link if no Stripe key is configured.
 */
export async function POST(req: NextRequest) {
  try {
    const { amount, description, businessName } = await req.json()
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      // Demo mode — return a test checkout URL
      return NextResponse.json({
        url: 'https://buy.stripe.com/test_demo',
        mode: 'demo',
      })
    }

    // Create Stripe price + payment link
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' })

    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100), // cents
      currency: 'usd',
      product_data: {
        name: `${businessName || 'Booking'} — ${description || 'Deposit'}`,
      },
    })

    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: {
        type: 'redirect',
        redirect: { url: `${process.env.NEXT_PUBLIC_APP_URL}/booking-confirmed` },
      },
    })

    return NextResponse.json({ url: link.url, mode: 'live' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create payment link'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
