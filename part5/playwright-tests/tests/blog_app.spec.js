const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createBlog, loginWith, openBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
  
    await page.goto('/')
  })
  
  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongpassword')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Playwright tests for blog app',
        'Matti Luukkainen',
        'https://example.com/playwright'
      )

      await expect(
        page.getByRole('link', { name: 'Playwright tests for blog app' })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'Likeable blog',
        'Matti Luukkainen',
        'https://example.com/likeable'
      )

      await openBlog(page, 'Likeable blog')
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.locator('.blog').getByText('likes 1')).toBeVisible()
    })

    test('the user who added a blog can remove it', async ({ page }) => {
      await createBlog(
        page,
        'Removable blog',
        'Matti Luukkainen',
        'https://example.com/removable'
      )

      await openBlog(page, 'Removable blog')
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('blog not found')).toBeVisible()
      await page.getByRole('link', { name: 'home' }).click()
      await expect(page.getByRole('link', { name: 'Removable blog' })).toHaveCount(0)
    })

    test('only the user who added a blog can see the remove button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'Other User',
          username: 'other',
          password: 'secret'
        }
      })

      await createBlog(
        page,
        'Owner-only remove blog',
        'Matti Luukkainen',
        'https://example.com/owner-only'
      )

      await openBlog(page, 'Owner-only remove blog')
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'other', 'secret')
      await openBlog(page, 'Owner-only remove blog')

      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'First blog', 'Matti Luukkainen', 'https://example.com/first')
      await createBlog(page, 'Second blog', 'Matti Luukkainen', 'https://example.com/second')
      await createBlog(page, 'Third blog', 'Matti Luukkainen', 'https://example.com/third')

      await openBlog(page, 'Second blog')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog').getByText('likes 1')).toBeVisible()
      await page.getByRole('link', { name: 'home' }).click()

      await openBlog(page, 'Third blog')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog').getByText('likes 1')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog').getByText('likes 2')).toBeVisible()
      await page.getByRole('link', { name: 'home' }).click()

      const blogLinks = page.locator('li a')
      await expect(blogLinks.nth(0)).toHaveText('Third blog')
      await expect(blogLinks.nth(1)).toHaveText('Second blog')
      await expect(blogLinks.nth(2)).toHaveText('First blog')
    })
  })
})
