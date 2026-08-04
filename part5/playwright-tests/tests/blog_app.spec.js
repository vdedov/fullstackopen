const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

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
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongpassword')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
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
        page.getByText('Playwright tests for blog app Matti Luukkainen')
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'Likeable blog',
        'Matti Luukkainen',
        'https://example.com/likeable'
      )

      const blog = page.locator('.blog').filter({ hasText: 'Likeable blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('the user who added a blog can remove it', async ({ page }) => {
      await createBlog(
        page,
        'Removable blog',
        'Matti Luukkainen',
        'https://example.com/removable'
      )

      const blog = page.locator('.blog').filter({ hasText: 'Removable blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('.blog').filter({ hasText: 'Removable blog' })).toHaveCount(0)
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

      const blog = page.locator('.blog').filter({ hasText: 'Owner-only remove blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'other', 'secret')

      await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'First blog', 'Matti Luukkainen', 'https://example.com/first')
      await createBlog(page, 'Second blog', 'Matti Luukkainen', 'https://example.com/second')
      await createBlog(page, 'Third blog', 'Matti Luukkainen', 'https://example.com/third')

      const firstBlog = page.locator('.blog').filter({ hasText: 'First blog' })
      const secondBlog = page.locator('.blog').filter({ hasText: 'Second blog' })
      const thirdBlog = page.locator('.blog').filter({ hasText: 'Third blog' })

      await firstBlog.getByRole('button', { name: 'view' }).click()
      await secondBlog.getByRole('button', { name: 'view' }).click()
      await thirdBlog.getByRole('button', { name: 'view' }).click()

      await secondBlog.getByRole('button', { name: 'like' }).click()
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog.getByText('likes 1')).toBeVisible()
      await thirdBlog.getByRole('button', { name: 'like' }).click()

      await expect(page.locator('.blog').nth(0)).toContainText('Third blog')
      await expect(page.locator('.blog').nth(1)).toContainText('Second blog')
      await expect(page.locator('.blog').nth(2)).toContainText('First blog')
    })
  })
})
