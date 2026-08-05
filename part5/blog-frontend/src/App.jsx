import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'
import Notification from './components/Notification'
import Home from './components/Home'
import Blog from './components/Blog'
import NewPlog from './components/NewBlog'
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
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const padding = {
    padding: 5
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        {user && <Link style={padding} to="/create">new blog</Link>}
        {!user
          ? <Link style={padding} to="/login">login</Link>
          : <Logout setUser={setUser} />
        }
        <Notification notification={notification} />
      </div>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            blog
              ? <Blog
                blog={blog}
                setBlogs={setBlogs}
                user={user}
              />
              : <div>blog not found</div>
          }
        />
        <Route path="/" element={<Home blogs={blogs} />} />
        <Route
          path="/login"
          element={!user ? loginForm() : <Home blogs={blogs} />}
        />
        <Route path="/create" element={
          <NewPlog
            setBlogs={setBlogs}
            setNotification={setNotification}
            user={user}
          />} />
      </Routes>
    </div>
  )
}

export default App
