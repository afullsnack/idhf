import { payloadAdminSplatRoute } from '@payloadcms/tanstack-start/client'
import { createFileRoute } from '@tanstack/react-router'

import { loadAdminPageRSC } from './server.functions.js'

export const Route = createFileRoute('/_payload/admin/$')(
  // See _payload.tsx — Payload canary helper types vs. TanStack Start version skew.
  payloadAdminSplatRoute({ load: loadAdminPageRSC }) as unknown as Parameters<
    typeof createFileRoute<'/_payload/admin/$'>
  >[0],
)
