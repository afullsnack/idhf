import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
import { admins } from '../access/admins'

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
        description:
          'Background image for the slide. Falls back to a branded gradient if neither image nor video is set.',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description:
          'Background video for the slide. Takes precedence over the image, and the carousel only advances once the video finishes playing. Cannot be combined with an image.',
      },
    },
    {
      name: 'countdownDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description:
          'Optional end date. Renders a countdown centred over the slide. The largest unit is whichever is still non-zero, so days dominate until only hours remain, then hours, minutes and seconds.',
      },
    },
    {
      name: 'countdownLabel',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional label shown above the countdown, e.g. "Inauguration Countdown".',
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
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (data?.video && data?.image) {
          throw new ValidationError({
            collection: HeroSlides.slug,
            errors: [
              {
                message:
                  'A slide can use either a background image or a background video, not both. Remove one of them.',
                path: 'video',
              },
            ],
            req,
          })
        }

        return data
      },
    ],
  },
}