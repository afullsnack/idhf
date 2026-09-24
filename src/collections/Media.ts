import type { CollectionConfig } from 'payload'
import { admins, authenticated } from '../access/admins'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    admin: admins,
    create: authenticated,
    read: () => true,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}