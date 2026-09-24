import type { Payload, PayloadEmailAdapter, SendEmailOptions } from 'payload'

interface PlunkEmailAdapterArgs {
  /**
   * Plunk secret API key (`sk_*`). Public (`pk_*`) keys only work on `/v1/track`.
   */
  apiKey: string
  /**
   * Fallback sender address when a message provides no `from`.
   */
  defaultFromAddress: string
  /**
   * Fallback sender display name when a message provides no `from`.
   */
  defaultFromName: string
  /**
   * Override the Plunk API base URL (mainly for self-hosted deployments).
   * @default 'https://next-api.useplunk.com'
   */
  baseUrl?: string
}

type NodemailerAddress = string | { name?: string; address: string }

type PlunkRecipient = string | { name?: string; email: string }

interface PlunkAttachment {
  filename: string
  content: string
  contentType: string
  contentId?: string
  disposition?: 'attachment' | 'inline'
}

interface PlunkSendRequest {
  to: PlunkRecipient[]
  from: { name?: string; email: string }
  subject?: string
  body?: string
  reply?: string
  headers?: Record<string, string>
  attachments?: PlunkAttachment[]
}

type PlunkSendError = {
  code?: string
  message?: string
  statusCode?: number
  requestId?: string
}

type PlunkSendResponse = {
  success?: boolean
  data?: {
    emails?: Array<{
      contact: { id: string; email: string }
      email: string
    }>
    timestamp?: string
  }
  error?: PlunkSendError
}

/**
 * Convert a nodemailer-compatible address (`string` or `{ name, address }`) into
 * the Plunk recipient shape (`string` or `{ name, email }`).
 */
function toPlunkRecipient(address: NodemailerAddress): PlunkRecipient {
  if (typeof address === 'string') return address
  if (address.name) return { name: address.name, email: address.address }
  return address.address
}

function collectRecipients(
  recipients: PlunkRecipient[],
  value: SendEmailOptions['to'] | SendEmailOptions['cc'] | SendEmailOptions['bcc']
): void {
  if (!value) return
  if (Array.isArray(value)) {
    for (const entry of value) recipients.push(toPlunkRecipient(entry))
    return
  }
  recipients.push(toPlunkRecipient(value))
}

function resolveFrom(
  value: SendEmailOptions['from'],
  defaultFromAddress: string,
  defaultFromName: string
): { name?: string; email: string } {
  if (typeof value === 'string') {
    const match = value.match(/^(.*)<([^>]+)>$/)
    if (match) {
      return { name: match[1].trim() || undefined, email: match[2].trim() }
    }
    return { email: value.trim() }
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return { name: value.name ?? undefined, email: value.address }
  }
  return { name: defaultFromName, email: defaultFromAddress }
}

function resolveReplyTo(value: SendEmailOptions['replyTo']): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const first = value[0]
    return typeof first === 'string' ? first : first?.address
  }
  return value.address
}

function toPlunkAttachments(attachments: SendEmailOptions['attachments']): PlunkAttachment[] | undefined {
  if (!attachments?.length) return undefined
  return attachments.map((attachment) => {
    if (attachment.path || attachment.raw || attachment.href) {
      throw new Error(
        'Plunk email adapter does not support file-path, raw, or href attachments; provide `content` as a Buffer or string.'
      )
    }

    let content: string
    if (Buffer.isBuffer(attachment.content)) {
      content = attachment.content.toString('base64')
    } else if (typeof attachment.content === 'string') {
      content = Buffer.from(attachment.content, 'utf-8').toString('base64')
    } else if (attachment.content != null) {
      throw new Error(
        'Plunk email adapter only supports Buffer or string attachment content; update the caller to pass a Buffer or string.'
      )
    } else {
      throw new Error('Plunk email adapter requires attachment `content`; none was provided.')
    }

    const inline = attachment.contentDisposition === 'inline' || Boolean(attachment.cid)

    return {
      filename: attachment.filename || 'attachment',
      content,
      contentType: attachment.contentType ?? 'application/octet-stream',
      ...(inline
        ? { disposition: 'inline' as const, contentId: attachment.cid ?? 'attachment' }
        : {}),
    }
  })
}

function toHeaders(headers: SendEmailOptions['headers']): Record<string, string> | undefined {
  if (!headers) return undefined
  const result: Record<string, string> = {}
  if (Array.isArray(headers)) {
    for (const { key, value } of headers) {
      result[key] = typeof value === 'string' ? value : String(value)
    }
    return result
  }
  const entries = Object.entries(headers)
  for (const [key, value] of entries) {
    if (typeof value === 'string') {
      result[key] = value
    } else if (Array.isArray(value)) {
      result[key] = value.join(', ')
    } else if (value && typeof value === 'object' && 'value' in value) {
      result[key] = value.value
    } else {
      result[key] = String(value)
    }
  }
  return result
}

function resolveBody(html: SendEmailOptions['html'], text: SendEmailOptions['text']): string | undefined {
  for (const value of [html, text]) {
    if (value == null) continue
    if (typeof value === 'string') return value
    if (Buffer.isBuffer(value)) return value.toString('utf-8')
    throw new Error(
      'Plunk email adapter only supports string or Buffer HTML/text bodies; update the caller to pass a string.'
    )
  }
  return undefined
}

/**
 * Build the `/v1/send` request body from a nodemailer-shaped message. Exported
 * separately so the mapping can be unit-tested without hitting the network.
 */
export function buildPlunkSendRequest(
  message: SendEmailOptions,
  options: Pick<PlunkEmailAdapterArgs, 'defaultFromAddress' | 'defaultFromName'>
): PlunkSendRequest {
  const recipients: PlunkRecipient[] = []
  collectRecipients(recipients, message.to)
  collectRecipients(recipients, message.cc)
  collectRecipients(recipients, message.bcc)

  if (recipients.length === 0) {
    throw new Error('Plunk email adapter requires at least one recipient (`to`, `cc`, or `bcc`).')
  }

  const subject = message.subject ? message.subject.replace(/[\r\n]+/g, ' ').trim() : undefined
  const body = resolveBody(message.html, message.text)
  if (!subject && !body) {
    throw new Error('Plunk email adapter requires either a `subject` or an HTML/`text` body.')
  }

  const reply = resolveReplyTo(message.replyTo)
  const headers = toHeaders(message.headers)
  const attachments = toPlunkAttachments(message.attachments)

  return {
    to: recipients,
    from: resolveFrom(message.from, options.defaultFromAddress, options.defaultFromName),
    ...(subject ? { subject } : {}),
    ...(body ? { body } : {}),
    ...(reply ? { reply } : {}),
    ...(headers ? { headers } : {}),
    ...(attachments ? { attachments } : {}),
  }
}

/**
 * Payload email adapter backed by the Plunk public API (`/v1/send`).
 *
 * ```ts
 * email: plunkEmailAdapter({
 *   apiKey: process.env.PLUNK_API_KEY || '',
 *   defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@example.com',
 *   defaultFromName: 'Example App',
 * }),
 * ```
 */
export const plunkEmailAdapter =
  ({
    apiKey,
    defaultFromAddress,
    defaultFromName,
    baseUrl = 'https://next-api.useplunk.com',
  }: PlunkEmailAdapterArgs): PayloadEmailAdapter =>
  ({ payload: _payload }: { payload: Payload }) => ({
    name: 'plunk',
    defaultFromAddress,
    defaultFromName,
    sendEmail: async (message: SendEmailOptions) => {
      if (!apiKey) {
        throw new Error('Plunk email adapter is not configured: missing `apiKey` (PLUNK_API_KEY).')
      }

      const request = buildPlunkSendRequest(message, { defaultFromAddress, defaultFromName })

      let response: Response
      try {
        response = await fetch(`${baseUrl}/v1/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(request),
        })
      } catch (cause) {
        throw new Error(`Plunk email adapter could not reach the Plunk API: ${(cause as Error).message}`, {
          cause,
        })
      }

      const body = (await response.json().catch(() => null)) as PlunkSendResponse | null

      if (!response.ok || !body?.success || !body?.data) {
        const error = body?.error
        const message = error?.message
          ? `[${error.code || 'ERROR'}] ${error.message}`
          : `Plunk email request failed with status ${response.status}.`
        const thrown = new Error(message)
        if (error?.requestId) {
          ;(thrown as Error & { requestId?: string }).requestId = error.requestId
        }
        throw thrown
      }

      return body.data
    },
  })