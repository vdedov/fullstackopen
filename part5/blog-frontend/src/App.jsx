import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import NewPost from './components/NewPost'
import LoginForm from './components/LoginForm'
import Logout from './components/Logout'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  const postFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.toSorted((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ text: 'wrong username or password', isError: true })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />

      {!user && loginForm()}
      {user && (
        <div>
          <div>
            {user.name} logged in <Logout setUser={setUser} />
          </div>
          <Togglable buttonLabel="create new blog" ref={postFormRef}>
            <NewPost
              setBlogs={setBlogs}
              setNotification={setNotification}
              toggleVisibility={() => postFormRef.current.toggleVisibility()}
            />
          </Togglable>
        </div>
      )}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} setBlogs={setBlogs}/>
      )}
    </div>
  )
}

export default App
