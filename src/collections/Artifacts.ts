import type { CollectionConfig } from 'payload'
import { admins } from '../access/admins'

export const Artifacts: CollectionConfig = {
  slug: 'artifacts',
  labels: {
    singular: 'Artifact',
    plural: 'Artifacts',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Homepage',
    description: 'Cultural artifacts preserved in the digital archive. Photos feed the collage on the landing page.',
    defaultColumns: ['name', 'era', '_status', 'updatedAt'],
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
      name: 'era',
      type: 'text',
      admin: {
        description: 'Historical period or provenance of the artifact.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Image of the artifact used in the collage.',
      },
    },
  ],
}