# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Landing Page >> should have navigation links
- Location: tests/e2e.spec.ts:16:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('nav')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('nav')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - img "Logo" [ref=e6]
          - generic [ref=e7]: AI SaaS Platform
        - generic [ref=e8]:
          - button "🌙" [ref=e9] [cursor=pointer]
          - button "Sign In" [ref=e10] [cursor=pointer]
          - button "Get Started" [ref=e11] [cursor=pointer]
    - generic [ref=e13]:
      - generic [ref=e14]:
        - img [ref=e15]
        - generic [ref=e18]: AI-Powered Platform
      - heading "Transform Your Business with AI" [level=1] [ref=e19]
      - paragraph [ref=e20]: Build, deploy, and scale AI-powered applications with our comprehensive SaaS platform. From code generation to content creation, we've got you covered.
      - generic [ref=e21]:
        - button "Start Free Trial" [ref=e22] [cursor=pointer]:
          - img [ref=e23]
          - text: Start Free Trial
        - button "Watch Demo" [ref=e28] [cursor=pointer]
    - generic [ref=e29]:
      - generic [ref=e30]:
        - heading "Powerful Features" [level=2] [ref=e31]
        - paragraph [ref=e32]: Everything you need to build and scale your AI-powered applications
      - generic [ref=e33]:
        - generic [ref=e35]:
          - generic [ref=e36]:
            - img [ref=e37]
            - heading "AI IDE in Browser" [level=3] [ref=e40]
          - paragraph [ref=e42]: Write code with AI assistance directly in your browser. Full IDE capabilities with intelligent autocomplete and code generation.
        - generic [ref=e44]:
          - generic [ref=e45]:
            - img [ref=e46]
            - heading "Content Studio" [level=3] [ref=e49]
          - paragraph [ref=e51]: Generate images, posts, ads, and videos with AI. Create stunning content in seconds, not hours.
        - generic [ref=e53]:
          - generic [ref=e54]:
            - img [ref=e55]
            - heading "Workflow Automation" [level=3] [ref=e57]
          - paragraph [ref=e59]: Automate repetitive tasks with AI-powered workflows. Build complex pipelines with simple drag-and-drop.
        - generic [ref=e61]:
          - generic [ref=e62]:
            - img [ref=e63]
            - heading "Enterprise Security" [level=3] [ref=e65]
          - paragraph [ref=e67]: Bank-grade security with RBAC, audit logs, and compliance. Your data is safe with us.
        - generic [ref=e69]:
          - generic [ref=e70]:
            - img [ref=e71]
            - heading "Global CDN" [level=3] [ref=e74]
          - paragraph [ref=e76]: Deploy your applications worldwide with our global content delivery network. Fast, reliable, and scalable.
        - generic [ref=e78]:
          - generic [ref=e79]:
            - img [ref=e80]
            - heading "Instant Deployment" [level=3] [ref=e85]
          - paragraph [ref=e87]: From code to production in minutes. Our platform handles all the infrastructure so you can focus on building.
    - generic [ref=e90]:
      - generic [ref=e91]:
        - heading "Ready to Get Started?" [level=3] [ref=e92]
        - paragraph [ref=e93]: Join thousands of businesses already using our AI platform to transform their operations
      - button "Start Your Free Trial" [ref=e95] [cursor=pointer]
    - contentinfo [ref=e96]:
      - paragraph [ref=e98]: © 2024 AI SaaS Platform. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e104] [cursor=pointer]:
    - img [ref=e105]
  - alert [ref=e108]
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
> 19  |     await expect(nav).toBeVisible()
      |                       ^ Error: expect(locator).toBeVisible() failed
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
  52  |     expect(response.status()).toBeLessThan(500)
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
```