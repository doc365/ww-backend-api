import { test, expect } from '@playwright/test';

test.describe('Data-Driven Negative Testing (Boundary/Negative)', () => {
  const badInputs = [
    {
      email: 'not-an-email',
      password: '123',
      expected: 401,
      desc: 'Invalid Email Format',
    },
    {
      email: 'test@test.com',
      password: '',
      expected: 401,
      desc: 'Missing Password',
    },
    {
      email: '',
      password: 'password123',
      expected: 401,
      desc: 'Missing Email',
    },
    {
      email: 'unknown_user999@test.com',
      password: 'wrongpassword',
      expected: 401,
      desc: 'Unauthorized Credentials',
    },
  ];

  for (const input of badInputs) {
    test(`Login fails with: ${input.desc}`, async ({ request }) => {
      const response = await request.post('/auth/login', {
        data: { email: input.email, password: input.password },
      });
      expect(response.status()).toBe(input.expected);
    });
  }
});
