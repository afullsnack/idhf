import { useMutation } from '@tanstack/react-query'
import type { NewsletterSubscriptionResult } from '@/lib/newsletter'

export function useSubscribeToNewsletter(mutationKey?: string[]) {
  return useMutation<NewsletterSubscriptionResult, Error, string>({
    mutationKey: ['subscribe-newsletter', ...(mutationKey ?? [])],
    mutationFn: async (email: string) => {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const result = (await response.json()) as NewsletterSubscriptionResult
      if (!response.ok && result.ok === false) {
        throw new Error(result.error)
      }
      return result
    },
  })
}