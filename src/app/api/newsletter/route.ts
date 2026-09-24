import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { NewsletterSubscriptionResult } from '@/lib/newsletter'
import type { NextRequest } from 'next/server'

const PLUNK_API_URL = 'https://next-api.useplunk.com/contacts'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const WELCOME_SUBJECT = 'Welcome to the Idoma Hall of Fame Newsletter'

function buildWelcomeEmail(email: string): string {
  return [
    '<div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto;">',
    '<h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to the Idoma Hall of Fame!</h1>',
    `<p style="margin-bottom: 12px;">Thank you for subscribing with <strong>${email}</strong>. You are now part of a growing community that celebrates Idoma excellence and preserves our cultural heritage.</p>`,
    '<p style="margin-bottom: 12px;">As a subscriber you will receive updates on:</p>',
    '<ul style="margin: 0 0 16px; padding-left: 20px;">',
    '<li>Events and programs</li>',
    '<li>New inductees and their stories</li>',
    '<li>Cultural programs and initiatives</li>',
    '</ul>',
    '<p style="margin-bottom: 24px;">If you did not sign up for this newsletter, you can simply ignore this email.</p>',
    '<p style="font-size: 14px; color: #6b7280;">Warm regards,<br />The Idoma Hall of Fame Team</p>',
    '</div>',
  ].join('')
}

/**
 * Sends the default welcome email to a newly subscribed contact.
 * Failures are logged but never fail the subscription itself.
 */
async function sendWelcomeEmail(email: string): Promise<void> {
  try {
    const config = await configPromise
    const payload = await getPayload({ config })

    await payload.sendEmail({
      to: email,
      subject: WELCOME_SUBJECT,
      html: buildWelcomeEmail(email),
    })
  } catch (error) {
    console.error('[newsletter] Failed to send welcome email', error)
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null
  const email = typeof body?.email === 'string' ? body.email.trim() : ''

  if (!EMAIL_REGEX.test(email)) {
    const result: NewsletterSubscriptionResult = {
      ok: false,
      error: 'Please enter a valid email address.',
    }
    return Response.json(result, { status: 400 })
  }

  const apiKey = process.env.PLUNK_API_KEY
  if (!apiKey) {
    const result: NewsletterSubscriptionResult = {
      ok: false,
      error: 'The newsletter service is not configured yet.',
    }
    return Response.json(result, { status: 503 })
  }

  try {
    const response = await fetch(PLUNK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        subscribed: true,
      }),
    })

    if (!response.ok) {
      let error = `Request failed with status ${response.status}.`
      try {
        const responseBody = (await response.json()) as {
          error?: { message?: string }
        }
        if (responseBody?.error?.message) error = responseBody.error.message
      } catch {
        // ignore malformed error body
      }
      const result: NewsletterSubscriptionResult = { ok: false, error }
      return Response.json(result, { status: response.status })
    }

    const contact = (await response.json()) as {
      id?: string
      email?: string
      _meta?: { isNew?: boolean }
    }

    const subscriberEmail = contact.email ?? email
    await sendWelcomeEmail(subscriberEmail)

    const result: NewsletterSubscriptionResult = {
      ok: true,
      id: contact.id ?? '',
      email: subscriberEmail,
      isNew: Boolean(contact._meta?.isNew),
    }
    return Response.json(result)
  } catch {
    const result: NewsletterSubscriptionResult = {
      ok: false,
      error: 'Could not reach the newsletter service.',
    }
    return Response.json(result, { status: 502 })
  }
}
