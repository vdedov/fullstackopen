import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewPost from './NewPost'

test('calls create handler with correct details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn().mockResolvedValue({
    title: 'Testing React components',
    author: 'Kent C. Dodds',
    url: 'https://example.com/testing-react-components'
  })

  const { container } = render(
    <NewPost
      setBlogs={() => {}}
      setNotification={() => {}}
      toggleVisibility={() => {}}
      createBlog={createBlog}
    />
  )

  const inputs = container.querySelectorAll('input')

  await user.type(inputs[0], 'Testing React components')
  await user.type(inputs[1], 'Kent C. Dodds')
  await user.type(inputs[2], 'https://example.com/testing-react-components')
  await user.click(screen.getByText('create'))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing React components',
    author: 'Kent C. Dodds',
    url: 'https://example.com/testing-react-components'
  })
})
