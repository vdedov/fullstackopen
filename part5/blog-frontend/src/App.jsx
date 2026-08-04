import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import NewPost from './components/NewPost'
import Login from './components/Login'
import Logout from './components/Logout'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />

      {!user && (
        <Login
          setUser={setUser}
          setNotification={setNotification}
        />)}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <h2>create new</h2>
          <NewPost
            setBlogs={setBlogs}
            setNotification={setNotification}
          />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}

          <Logout setUser={setUser} />
        </div>
      )}
    </div>
  )
}

export default App
