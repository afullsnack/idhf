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