import { payloadLayoutRoute } from '@payloadcms/tanstack-start/client'
import { createFileRoute } from '@tanstack/react-router'
import '@/payload-foundation.css'
import '@payloadcms/ui/css/app.css'

import { getLayoutDataFn, serverFunctionHandler } from './_payload/server.functions.js'

export const Route = createFileRoute('/_payload')(
  // Version skew: the Payload canary helper types `staleReloadMode` as `string`,
  // while installed TanStack Start requires the narrower `LoaderStaleReloadMode`.
  // The payload helper is the source of truth here, so normalize at the seam.
  payloadLayoutRoute({
    load: getLayoutDataFn,
    serverFunction: serverFunctionHandler,
  }) as unknown as Parameters<typeof createFileRoute<'/_payload'>>[0],
)
