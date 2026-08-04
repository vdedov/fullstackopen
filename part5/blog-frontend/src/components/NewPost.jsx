import { useState } from 'react'
import blogService from '../services/blogs'

const NewPost = ({setBlogs, setNotification, toggleVisibility}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewPost = async event => {
    event.preventDefault()

    try {
      const post = await blogService.create({ title, author, url })
      setBlogs(blog => blog.concat(post))
      setTitle('')
      setAuthor('')
      setUrl('')
      toggleVisibility()
      setNotification({ text: 'a new post has been added', isError: false })
    } catch {
      setNotification({ text: 'something went wrong', isError: true })
    } finally {
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewPost}>
        <div>
            title
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
        </div>
        <div>
            author
            <input
              value={author}
              onChange={event => setAuthor(event.target.value)}
            />
        </div>
        <div>
            url
            <input
              value={url}
              onChange={event => setUrl(event.target.value)}
            />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default NewPost
