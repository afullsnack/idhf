import { redirect } from 'next/navigation'
import { DefaultDashboard, type DashboardViewServerProps } from '@payloadcms/next/views'
import type { User } from '@/payload-types'

function getAccountRoute(props: DashboardViewServerProps): string {
  const adminRoute = props.initPageResult.req.payload.config.routes.admin ?? '/admin'
  return `${adminRoute}/account`
}

/**
 * Replaces the admin dashboard. Admins keep the full default Payload dashboard,
 * while regular `user` role accounts are sent straight to their own profile
 * (aka the "Account" view) where they can edit their data.
 */
export default function Dashboard(props: DashboardViewServerProps) {
  const currentUser = props.initPageResult.req.user as User | null

  if (currentUser && currentUser.role !== 'admin') {
    redirect(getAccountRoute(props))
  }

  return <DefaultDashboard {...props} />
}