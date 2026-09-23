import { useMutation } from '@tanstack/react-query'
import {
  subscribeToNewsletter,
  type NewsletterSubscriptionResult,
} from '@/functions/newsletter.functions'

export function useSubscribeToNewsletter(mutationKey?: string[]) {
  return useMutation<NewsletterSubscriptionResult, Error, string>({
    mutationKey: ['subscribe-newsletter', ...(mutationKey ?? [])],
    mutationFn: (email: string) => subscribeToNewsletter({ data: { email } }),
  })
}