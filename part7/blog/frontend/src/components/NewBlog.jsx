import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { useNotificationActions } from '../stores/notifications'

import { TextField, Button } from '@mui/material'

const NewBlog = ({ setBlogs, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const { setNotification } = useNotificationActions()

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = { title, author, url }
      const blog = await blogService.create(newBlog)
      const blogWithUser = user
        ? { ...blog, user: { username: user.username, name: user.name } }
        : blog

      setBlogs((blog) => blog.concat(blogWithUser))
      navigate('/')
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotification('a new post has been added', false)
    } catch {
      setNotification('something went wrong', true)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <TextField
            value={title}
            placeholder="title"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <TextField
            value={author}
            placeholder="author"
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <TextField
            value={url}
            placeholder="url"
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <Button type="submit" variant="contained">
          create
        </Button>
      </form>
    </div>
  )
}

export default NewBlog
