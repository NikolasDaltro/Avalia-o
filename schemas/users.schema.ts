export const usersSchema = {
  type: 'object',
  required: [
    'page',
    'per_page',
    'total',
    'total_pages',
    'data'
  ],

  properties: {
    page: {
      type: 'number'
    },

    per_page: {
      type: 'number'
    },

    total: {
      type: 'number'
    },

    total_pages: {
      type: 'number'
    },

    data: {
      type: 'array',

      items: {
        type: 'object',

        required: [
          'id',
          'email',
          'first_name',
          'last_name',
          'avatar'
        ],

        properties: {
          id: {
            type: 'number'
          },

          email: {
            type: 'string',
            format: 'email'
          },

          first_name: {
            type: 'string',
            minLength: 1
          },

          last_name: {
            type: 'string',
            minLength: 1
          },

          avatar: {
            type: 'string',
            format: 'uri'
          }
        },

        additionalProperties: true
      }
    },

    support: {
      type: 'object'
    }
  },

  additionalProperties: true
};