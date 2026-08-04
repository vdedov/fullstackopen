import { useState } from 'react'
import blogService from '../services/blogs'

const NewPost = ({setBlogs, setNotification}) => {
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
    <form onSubmit={handleNewPost}>
      <div>
        <label>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default NewPost