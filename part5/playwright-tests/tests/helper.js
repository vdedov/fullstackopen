const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.locator('input').nth(0).fill(title)
  await page.locator('input').nth(1).fill(author)
  await page.locator('input').nth(2).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

module.exports = { loginWith, createBlog }
