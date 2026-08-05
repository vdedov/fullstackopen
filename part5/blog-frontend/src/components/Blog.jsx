import blogService from '../services/blogs'

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
        {blog.title} {blog.author}
      </div>
      <p>{blog.url}</p>
      <p>
        likes {blog.likes}
        {user && <button onClick={() => incLike()}>like</button>}
      </p>
      <p>{blog.author}</p>
      {canRemove && <button onClick={() => handleRemove()}>remove</button>}
    </div>
  )
}

export default Blog
