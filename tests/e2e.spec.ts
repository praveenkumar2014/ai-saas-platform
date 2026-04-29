import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/AI SaaS Platform/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have brand logo', async ({ page }) => {
    await page.goto('/')
    const logo = page.locator('img[src*="gsgroups.net"]')
    await expect(logo).toBeVisible()
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should have dark/light mode toggle', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('button').filter({ hasText: /dark|light/i })
    await expect(toggle).toBeVisible()
  })
})

test.describe('Dashboard', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have sidebar navigation', async ({ page }) => {
    await page.goto('/dashboard')
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
  })
})

test.describe('API Endpoints', () => {
  test('health check - auth register endpoint', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        email: 'test@example.com',
        password: 'test123456',
        name: 'Test User',
      },
    })
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(500)
  })

  test('health check - auth login endpoint', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'test123456',
      },
    })
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(500)
  })

  test('health check - AI chat endpoint', async ({ request }) => {
    const response = await request.post('/api/ai/chat', {
      data: {
        message: 'Hello',
        model: 'gpt-4',
      },
    })
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(500)
  })

  test('health check - users endpoint', async ({ request }) => {
    const response = await request.get('/api/users/me')
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(500)
  })

  test('health check - payment intent endpoint', async ({ request }) => {
    const response = await request.post('/api/payments/create-intent', {
      data: {
        amount: 1000,
        currency: 'INR',
        planType: 'BASIC',
      },
    })
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(500)
  })

  test('health check - payment webhook endpoint', async ({ request }) => {
    const response = await request.post('/api/payments/webhook', {
      data: {
        paymentId: 'test_payment_id',
        status: 'succeeded',
      },
    })
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(500)
  })
})

test.describe('Component Pages', () => {
  test('should load chat interface', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have responsive design', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('nav')).toBeVisible()
  })
})

test.describe('SEO Meta Tags', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/')
    
    const title = await page.title()
    expect(title).toContain('AI SaaS Platform')
    
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
  })

  test('should have Open Graph tags', async ({ page }) => {
    await page.goto('/')
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
  })
})
