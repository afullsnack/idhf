import type { CollectionConfig } from 'payload'
import { admins } from '../access/admins'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Homepage',
    description: 'Upcoming events and programs. Featured events display as the headline card on the landing page.',
    defaultColumns: ['title', 'category', 'date', 'venue', 'featured', '_status', 'updatedAt'],
  },
  defaultSort: 'date',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: ['Gala', 'Education', 'Festival', 'Technology', 'Community'],
      admin: {
        description: 'Used for the category chip displayed on the event card.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Mark to feature this event as the headline card. Falls back to the earliest event if none is marked.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short blurb shown on the event card.',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'venue',
      type: 'text',
      admin: {
        description: 'Location of the event, e.g. "Otukpo Cultural Center".',
      },
    },
    {
      name: 'expected',
      type: 'text',
      admin: {
        description: 'Expected attendance, e.g. "500+ Expected".',
      },
    },
    {
      name: 'registerUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Optional link for the "Register" button. Falls back to "/events".',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Background image for the event card. Falls back to a branded gradient if empty.',
      },
    },
  ],
}