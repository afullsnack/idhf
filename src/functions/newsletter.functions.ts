import { createServerFn } from '@tanstack/react-start'

const PLUNK_API_URL = 'https://next-api.useplunk.com/contacts'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type NewsletterSubscriptionResult =
  | {
      ok: true
      id: string
      email: string
      isNew: boolean
    }
  | {
      ok: false
      error: string
    }

type SubscribeInput = {
  email: string
}

export const subscribeToNewsletter = createServerFn({ method: 'POST' })
  .validator((input: SubscribeInput) => ({
    email: typeof input?.email === 'string' ? input.email.trim() : '',
  }))
  .handler(async ({ data }): Promise<NewsletterSubscriptionResult> => {
    const { email } = data

    if (!EMAIL_REGEX.test(email)) {
      return { ok: false, error: 'Please enter a valid email address.' }
    }

    const apiKey = process.env.PLUNK_API_KEY
    if (!apiKey) {
      return { ok: false, error: 'The newsletter service is not configured yet.' }
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
          const body = (await response.json()) as {
            error?: { message?: string }
          }
          if (body?.error?.message) error = body.error.message
        } catch {
          // ignore malformed error body
        }
        return { ok: false, error }
      }

      const contact = (await response.json()) as {
        id?: string
        email?: string
        _meta?: { isNew?: boolean }
      }

      return {
        ok: true,
        id: contact.id ?? '',
        email: contact.email ?? email,
        isNew: Boolean(contact._meta?.isNew),
      }
    } catch {
      return { ok: false, error: 'Could not reach the newsletter service.' }
    }
  })
