import { test, expect } from '@playwright/test';

test.describe('GET /api/users', () => {

  test('deve retornar os usuários da página 2', async ({ request }) => {

    const response = await request.get('/api/users', {
      params: {
        page: '2'
      },

      headers: {
        'x-api-key': process.env.REQRES_API_KEY!,
        'X-Reqres-Env': 'prod'
      }
    });

    console.log('Status:', response.status());
    console.log('Response:', await response.text());

    expect(response.status()).toBe(200);
  });

});