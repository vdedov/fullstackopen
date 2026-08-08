import blogService from '../services/blogs'

import { Button } from '@mui/material'

const Blog = ({ blog, setBlogs, handleLike, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const incLike = async () => {
    if (handleLike) {
      handleLike(blog)
      return
    }

    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1
    })

    setBlogs(blogs =>
      blogs
        .map(b => b.id === blog.id ? { ...updatedBlog, user: blog.user } : b)
        .toSorted((a, b) => b.likes - a.likes)
    )
  }

  const handleRemove = async () => {
    if (!window.confirm(`Remove blog ${blog.title}`)) {
      return
    }

    await blogService.remove(blog)
    setBlogs(blogs =>
      blogs.filter(b => b.id !== blog.id)
    )
  }

  const canRemove = blog.user?.username === user?.username

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">
        <h2>{blog.title}</h2>
        <p>by {blog.author}</p>
      </div>
      <a
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {blog.url}
      </a>
      <p>
        {blog.likes} likes
        {user && <Button variant='outlined' onClick={() => incLike()}>like</Button>}
        {canRemove && <Button variant='outlined' color='error' onClick={() => handleRemove()}>remove</Button>}
      </p>
    </div>
  )
}

export default Blog
