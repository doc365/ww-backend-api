/* eslint-disable */
import { test, expect } from '@playwright/test';

test.describe('E2E Integration: Auth & Task CRUD Lifecycle', () => {
  const randomId = Math.floor(Math.random() * 100000);
  const user = {
    email: `playwright${randomId}@test.com`,
    password: 'password123',
  };
  let token = '';
  let taskId: string;

  test('1. Register User', async ({ request }) => {
    const response = await request.post('/auth/register', { data: user });
    expect([200, 201]).toContain(response.status());
  });

  test('2. Login to extract JWT token', async ({ request }) => {
    const response = await request.post('/auth/login', { data: user });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json).toHaveProperty('access_token');
    token = json.access_token;
  });

  test('3. Create a Task (CRUD: Create)', async ({ request }) => {
    const response = await request.post('/task', {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Playwright Task', description: 'Automated E2E task' },
    });
    expect(response.status()).toBe(201);
    const json = await response.json();
    taskId = json.id;
    expect(taskId).toBeDefined();
  });

  test('4. Fetch the Task (CRUD: Read)', async ({ request }) => {
    const response = await request.get(`/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.title).toBe('Playwright Task');
  });

  test('5. Delete the Task (CRUD: Delete) to clean up DB', async ({
    request,
  }) => {
    const response = await request.delete(`/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.ok()).toBeTruthy();
  });
});
