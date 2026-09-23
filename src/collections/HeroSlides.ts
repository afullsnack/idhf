import type { CollectionConfig } from 'payload'

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  labels: {
    singular: 'Hero Slide',
    plural: 'Hero Slides',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Homepage',
    description: 'Slides for the vertical hero carousel on the landing page.',
    defaultColumns: ['title', 'eyebrow', 'order', '_status', 'updatedAt'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Short overline label shown above the title, e.g. "A Sanctuary of Cultural Pride".',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main headline for this slide.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Supporting description rendered under the title.',
      },
    },
    {
      name: 'callToActions',
      type: 'array',
      label: 'Call to Actions',
      admin: {
        description: 'Buttons rendered for this slide. The first one displays as the primary action.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'secondary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Link', value: 'link' },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Background image for the slide. Falls back to a branded gradient if empty.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Sort order within the carousel. Lower numbers appear first.',
      },
    },
  ],
}