import type { NewsletterSubscriptionResult } from '@/lib/newsletter'
import type { NextRequest } from 'next/server'

const PLUNK_API_URL = 'https://next-api.useplunk.com/contacts'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    const result: NewsletterSubscriptionResult = {
      ok: true,
      id: contact.id ?? '',
      email: contact.email ?? email,
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