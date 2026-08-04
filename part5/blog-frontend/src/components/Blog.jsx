import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, handleLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isDetailed, setDetailed] = useState(false)

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
      blogs.map(b => b.id === blog.id ? updatedBlog : b)
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

  const viewDetails = () => (
    <div>
      <p>{blog.url}</p>
      <p>
        likes {blog.likes}
        <button onClick={() => incLike()}>like</button>
      </p>
      <p>{blog.author}</p>
      <button onClick={() => handleRemove()}>remove</button>
    </div>
  )

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}
      </div>
      <button onClick={() => setDetailed(!isDetailed)}>
        {isDetailed ? 'hide' : 'view'}
      </button>
      {isDetailed && viewDetails()}
    </div>
  )
}

export default Blog
