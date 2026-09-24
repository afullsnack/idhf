import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { admins, adminsOrSelf } from '../access/admins'
import type { User } from '@/payload-types'

/**
 * Automatically assigns the role when a user document is created or updated.
 *
 * - The very first account ever created becomes `admin`.
 * - Every account created afterwards becomes `user` unless a role is
 *   explicitly assigned by an admin. Field-level access already prevents
 *   non-admins from sending a `role` value in normal requests, so this only
 *   needs to apply a safe default.
 * - Non-admins can never change their own role on update.
 */
const assignRole: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  const isAdmin = (req.user as User | null)?.role === 'admin'

  if (operation === 'create') {
    const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })

    if (totalDocs === 0) {
      // The first account ever created bootstraps the dashboard as `admin`.
      data.role = 'admin'
    } else if (!data.role) {
      // Everyone else is a regular user — role is never user-selectable.
      data.role = 'user'
    }

    return data
  }

  if (operation === 'update' && !isAdmin) {
    // Never let a non-admin escalate (or change) their own role.
    delete data.role
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  auth: true,
  access: {
    create: () => true,
    read: adminsOrSelf,
    update: adminsOrSelf,
    delete: admins,
    admin: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeChange: [assignRole],
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Full name shown on the profile.',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Profile image shown on the account page.',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
      saveToJWT: true,
      admin: {
        position: 'sidebar',
        description: 'Admins manage the whole dashboard; users only see their own profile.',
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
  ],
  versions: false,
}
