import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import NewBlog from './NewBlog'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn()
  }
}))

test('calls create handler with correct details when a new blog is created', async () => {
  const user = userEvent.setup()
  blogService.create.mockResolvedValue({
    title: 'Testing React components',
    author: 'Kent C. Dodds',
    url: 'https://example.com/testing-react-components'
  })

  const { container } = render(
    <MemoryRouter>
      <NewBlog
        setBlogs={() => {}}
        setNotification={() => {}}
      />
    </MemoryRouter>
  )

  const inputs = container.querySelectorAll('input')

  await user.type(inputs[0], 'Testing React components')
  await user.type(inputs[1], 'Kent C. Dodds')
  await user.type(inputs[2], 'https://example.com/testing-react-components')
  await user.click(screen.getByText('create'))

  expect(blogService.create).toHaveBeenCalledTimes(1)
  expect(blogService.create).toHaveBeenCalledWith({
    title: 'Testing React components',
    author: 'Kent C. Dodds',
    url: 'https://example.com/testing-react-components'
  })
})
