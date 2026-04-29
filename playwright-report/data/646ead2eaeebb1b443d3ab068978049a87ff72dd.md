# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> API Endpoints >> health check - auth register endpoint
- Location: tests/e2e.spec.ts:43:7

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 500
Received:   500
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('Landing Page', () => {
  4   |   test('should load landing page successfully', async ({ page }) => {
  5   |     await page.goto('/')
  6   |     await expect(page).toHaveTitle(/AI SaaS Platform/)
  7   |     await expect(page.locator('h1')).toBeVisible()
  8   |   })
  9   | 
  10  |   test('should have brand logo', async ({ page }) => {
  11  |     await page.goto('/')
  12  |     const logo = page.locator('img[src*="gsgroups.net"]')
  13  |     await expect(logo).toBeVisible()
  14  |   })
  15  | 
  16  |   test('should have navigation links', async ({ page }) => {
  17  |     await page.goto('/')
  18  |     const nav = page.locator('nav')
  19  |     await expect(nav).toBeVisible()
  20  |   })
  21  | 
  22  |   test('should have dark/light mode toggle', async ({ page }) => {
  23  |     await page.goto('/')
  24  |     const toggle = page.locator('button').filter({ hasText: /dark|light/i })
  25  |     await expect(toggle).toBeVisible()
  26  |   })
  27  | })
  28  | 
  29  | test.describe('Dashboard', () => {
  30  |   test('should load dashboard page', async ({ page }) => {
  31  |     await page.goto('/dashboard')
  32  |     await expect(page.locator('h1')).toBeVisible()
  33  |   })
  34  | 
  35  |   test('should have sidebar navigation', async ({ page }) => {
  36  |     await page.goto('/dashboard')
  37  |     const sidebar = page.locator('aside')
  38  |     await expect(sidebar).toBeVisible()
  39  |   })
  40  | })
  41  | 
  42  | test.describe('API Endpoints', () => {
  43  |   test('health check - auth register endpoint', async ({ request }) => {
  44  |     const response = await request.post('/api/auth/register', {
  45  |       data: {
  46  |         email: 'test@example.com',
  47  |         password: 'test123456',
  48  |         name: 'Test User',
  49  |       },
  50  |     })
  51  |     expect(response.status()).toBeGreaterThanOrEqual(200)
> 52  |     expect(response.status()).toBeLessThan(500)
      |                               ^ Error: expect(received).toBeLessThan(expected)
  53  |   })
  54  | 
  55  |   test('health check - auth login endpoint', async ({ request }) => {
  56  |     const response = await request.post('/api/auth/login', {
  57  |       data: {
  58  |         email: 'test@example.com',
  59  |         password: 'test123456',
  60  |       },
  61  |     })
  62  |     expect(response.status()).toBeGreaterThanOrEqual(200)
  63  |     expect(response.status()).toBeLessThan(500)
  64  |   })
  65  | 
  66  |   test('health check - AI chat endpoint', async ({ request }) => {
  67  |     const response = await request.post('/api/ai/chat', {
  68  |       data: {
  69  |         message: 'Hello',
  70  |         model: 'gpt-4',
  71  |       },
  72  |     })
  73  |     expect(response.status()).toBeGreaterThanOrEqual(200)
  74  |     expect(response.status()).toBeLessThan(500)
  75  |   })
  76  | 
  77  |   test('health check - users endpoint', async ({ request }) => {
  78  |     const response = await request.get('/api/users/me')
  79  |     expect(response.status()).toBeGreaterThanOrEqual(200)
  80  |     expect(response.status()).toBeLessThan(500)
  81  |   })
  82  | 
  83  |   test('health check - payment intent endpoint', async ({ request }) => {
  84  |     const response = await request.post('/api/payments/create-intent', {
  85  |       data: {
  86  |         amount: 1000,
  87  |         currency: 'INR',
  88  |         planType: 'BASIC',
  89  |       },
  90  |     })
  91  |     expect(response.status()).toBeGreaterThanOrEqual(200)
  92  |     expect(response.status()).toBeLessThan(500)
  93  |   })
  94  | 
  95  |   test('health check - payment webhook endpoint', async ({ request }) => {
  96  |     const response = await request.post('/api/payments/webhook', {
  97  |       data: {
  98  |         paymentId: 'test_payment_id',
  99  |         status: 'succeeded',
  100 |       },
  101 |     })
  102 |     expect(response.status()).toBeGreaterThanOrEqual(200)
  103 |     expect(response.status()).toBeLessThan(500)
  104 |   })
  105 | })
  106 | 
  107 | test.describe('Component Pages', () => {
  108 |   test('should load chat interface', async ({ page }) => {
  109 |     await page.goto('/dashboard')
  110 |     await expect(page.locator('body')).toBeVisible()
  111 |   })
  112 | 
  113 |   test('should have responsive design', async ({ page }) => {
  114 |     await page.goto('/')
  115 |     await page.setViewportSize({ width: 375, height: 667 })
  116 |     await expect(page.locator('nav')).toBeVisible()
  117 |   })
  118 | })
  119 | 
  120 | test.describe('SEO Meta Tags', () => {
  121 |   test('should have proper meta tags', async ({ page }) => {
  122 |     await page.goto('/')
  123 |     
  124 |     const title = await page.title()
  125 |     expect(title).toContain('AI SaaS Platform')
  126 |     
  127 |     const description = await page.locator('meta[name="description"]').getAttribute('content')
  128 |     expect(description).toBeTruthy()
  129 |   })
  130 | 
  131 |   test('should have Open Graph tags', async ({ page }) => {
  132 |     await page.goto('/')
  133 |     const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
  134 |     expect(ogTitle).toBeTruthy()
  135 |   })
  136 | })
  137 | 
```