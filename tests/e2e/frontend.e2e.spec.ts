import { test, expect } from '@playwright/test'

test('can go on homepage', async ({ page }) => {
  await page.goto('http://localhost:3000')

  await expect(page).toHaveTitle(/Idoma Hall of Fame/)

  const heading = page.locator('h1').first()
  await expect(heading).toContainText(/Welcome to the Idoma Hall of Fame|Welcome/i)
})