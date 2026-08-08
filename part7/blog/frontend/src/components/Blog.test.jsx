import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Matti Luukkainen',
  url: 'https://example.com/blog',
  likes: 7,
  id: '12345',
  user: {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
  },
}

test('shows blog details and no action buttons for unauthenticated users', () => {
  const { container } = render(<Blog blog={blog} setBlogs={() => {}} />)

  const summary = container.querySelector('.blog-summary')

  expect(summary).toHaveTextContent(blog.title)
  expect(summary).toHaveTextContent(blog.author)
  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument()
  expect(screen.queryByText('like')).not.toBeInTheDocument()
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})

test('shows only like button for authenticated users who are not the creator', () => {
  render(
    <Blog
      blog={blog}
      setBlogs={() => {}}
      user={{ username: 'other-user', name: 'Other User' }}
    />,
  )

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.queryByText('remove')).not.toBeInTheDocument()
})

test('shows remove button for the blog creator', () => {
  render(
    <Blog
      blog={blog}
      setBlogs={() => {}}
      user={{ username: 'mluukkai', name: 'Matti Luukkainen' }}
    />,
  )

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.getByText('remove')).toBeInTheDocument()
})

test('calls like handler twice when like button is clicked twice', async () => {
  const user = userEvent.setup()
  const handleLike = vi.fn()

  render(
    <Blog
      blog={blog}
      setBlogs={() => {}}
      handleLike={handleLike}
      user={{ username: 'other-user', name: 'Other User' }}
    />,
  )

  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))

  expect(handleLike).toHaveBeenCalledTimes(2)
})
