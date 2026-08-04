import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Matti Luukkainen',
  url: 'https://example.com/blog',
  likes: 7,
  id: '12345'
}

test('renders title and author but not url or likes by default', () => {
  const { container } = render(<Blog blog={blog} setBlogs={() => {}} />)

  const summary = container.querySelector('.blog-summary')

  expect(summary).toHaveTextContent(blog.title)
  expect(summary).toHaveTextContent(blog.author)
  expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
  expect(screen.queryByText(`likes ${blog.likes}`)).not.toBeInTheDocument()
})

test('renders url and likes after clicking view button', async () => {
  const user = userEvent.setup()

  render(<Blog blog={blog} setBlogs={() => {}} />)

  await user.click(screen.getByText('view'))

  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument()
})

test('calls like handler twice when like button is clicked twice', async () => {
  const user = userEvent.setup()
  const handleLike = vi.fn()

  render(<Blog blog={blog} setBlogs={() => {}} handleLike={handleLike} />)

  await user.click(screen.getByText('view'))
  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))

  expect(handleLike).toHaveBeenCalledTimes(2)
})
