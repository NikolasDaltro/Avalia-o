import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { usersSchema } from '../../schemas/users.schema';

const ajv = new Ajv({
  allErrors: true
});

addFormats(ajv);

const validateUsersSchema = ajv.compile(usersSchema);

test.describe('GET /api/users', () => {

  test('deve retornar os usuários da página 2', async ({ request }) => {

    const response = await request.get('/api/users', {
      params: {
        page: '2'
      },

      headers: {
        'x-api-key': process.env.REQRES_API_KEY!
      }
    });

    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];

    expect(contentType).toContain('application/json');

    const body = await response.json();

    expect(body.page).toBe(2);

    expect(body).toHaveProperty('per_page');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('total_pages');
    expect(body).toHaveProperty('data');

    expect(Array.isArray(body.data)).toBeTruthy();

    const schemaIsValid = validateUsersSchema(body);

    expect(
      schemaIsValid,
      JSON.stringify(validateUsersSchema.errors, null, 2)
    ).toBeTruthy();
  });

});