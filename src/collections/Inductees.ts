import type { CollectionConfig } from 'payload'
import { admins } from '../access/admins'

export const Inductees: CollectionConfig = {
  slug: 'inductees',
  labels: {
    singular: 'Inductee',
    plural: 'Inductees',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Homepage',
    description: 'Individuals honored in the Idoma Hall of Fame. Photos feed the hero collage on the landing page.',
    defaultColumns: ['name', 'category', 'year', '_status', 'updatedAt'],
  },
  defaultSort: '-createdAt',
  access: {
    admin: admins,
    create: admins,
    read: () => true,
    update: admins,
    delete: admins,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: ['Culture', 'Leadership', 'Innovation', 'Community Development'],
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        description: 'Year of induction.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Portrait photo used in the collage.',
      },
    },
  ],
}