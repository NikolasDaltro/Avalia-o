import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { usersSchema } from '../../schemas/users.schema';

const ajv = new Ajv({
  allErrors: true
});

addFormats(ajv);

const validateUsersSchema = ajv.compile(usersSchema);

const apiKey = process.env.REQRES_API_KEY;

if (!apiKey) {
  throw new Error('REQRES_API_KEY não encontrada no arquivo .env');
}

test.describe('GET /api/users', () => {
//Cenario Negativo
test('deve retornar 401 quando a API Key não for informada', async ({ request }) => {
  const response = await request.get('/api/users', {
    params: {
      page: '2'
    }
  });

  expect(response.status()).toBe(401);

  const body = await response.json();

  expect(body).toHaveProperty('error');
});

test('deve retornar 403 quando a API Key for inválida', async ({ request }) => {
  const response = await request.get('/api/users', {
    params: {
      page: '2'
    },
    headers: {
      'x-api-key': 'chave-invalida'
    }
  });

  expect(response.status()).toBe(403);

  const body = await response.json();

  expect(body).toHaveProperty('error');
  expect(body.error).toBe('invalid_api_key');
});

test('deve tratar consulta de uma página inexistente de forma consistente', async ({ request }) => {
  const response = await request.get('/api/users', {
    params: {
      page: '999'
    },
    headers: {
      'x-api-key': apiKey
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.page).toBe(999);
  expect(Array.isArray(body.data)).toBeTruthy();
  expect(body.data).toHaveLength(0);
});

test('deve tratar parâmetro page com valor não numérico', async ({ request }) => {
  const response = await request.get('/api/users', {
    params: {
      page: 'abc'
    },
    headers: {
      'x-api-key': apiKey
    }
  });

  expect(response.status()).not.toBe(500);
});

//Cenario Positivo
  test('deve retornar os usuários da página 2', async ({ request }) => {
    const response = await request.get('/api/users', {
      params: {
        page: '2'
      },
      headers: {
        'x-api-key': apiKey
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

  const pages = [1, 2];

  for (const page of pages) {
    test(`deve retornar corretamente a página ${page}`, async ({ request }) => {
      const response = await request.get('/api/users', {
        params: {
          page: String(page)
        },
        headers: {
          'x-api-key': apiKey
        }
      });

      expect(response.status()).toBe(200);

      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');

      const body = await response.json();

      expect(body.page).toBe(page);

      const schemaIsValid = validateUsersSchema(body);

      expect(
        schemaIsValid,
        JSON.stringify(validateUsersSchema.errors, null, 2)
      ).toBeTruthy();
    });
  }

  test('deve responder dentro do tempo limite aceitável', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.get('/api/users', {
      params: {
        page: '2'
      },
      headers: {
        'x-api-key': apiKey
      }
    });

    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);

    console.log(`Tempo de resposta: ${responseTime}ms`);

    expect(responseTime).toBeLessThan(3000);
  });

});