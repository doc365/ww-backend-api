/* eslint-disable */
import { test, expect } from '@playwright/test';

test('Health Check API - Playwright', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.ok()).toBeTruthy();

  const json = await response.json();
  expect(json.status).toBe('ok');
  expect(json.service).toBe('pern-stack-task-management-system');
});
