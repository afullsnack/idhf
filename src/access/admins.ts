import type { Access, PayloadRequest, Where } from 'payload'
import type { User } from '@/payload-types'

/** Signature used by collection `admin` access and field-level `access`. */
type BooleanAccess = ({ req }: { req: PayloadRequest }) => boolean | Promise<boolean>

/** True only for signed-in users holding the `admin` role. */
export const admins: BooleanAccess = ({ req: { user } }) =>
  (user as User | null | undefined)?.role === 'admin'

/** True for any signed-in user (used for admin-panel login / profile access). */
export const authenticated: BooleanAccess = ({ req: { user } }) => Boolean(user)

/**
 * Admins can touch every row; regular users are limited to their own record
 * via a query constraint (row-level security), which also works for `read`.
 */
export const adminsOrSelf: Access = ({ req: { user } }): boolean | Where => {
  const currentUser = user as User | null | undefined
  if (!currentUser) return false
  if (currentUser.role === 'admin') return true
  return { id: { equals: currentUser.id } }
}