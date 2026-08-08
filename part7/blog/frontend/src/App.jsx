import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Notification from './components/Notification'
import Home from './components/Home'
import Blog from './components/Blog'
import NewPlog from './components/NewBlog'
import LoginForm from './components/LoginForm'
import Logout from './components/Logout'
import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationActions } from './stores/notifications'

import { Container, AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
  })
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { setNotification } = useNotificationActions()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.toSorted((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification('wrong username or password', true)
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

  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            home
          </Button>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={hoverStyle}
            >
              new blog
            </Button>
          )}
          {!user ? (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          ) : (
            <Logout setUser={setUser} />
          )}
        </Toolbar>
      </AppBar>
      <ErrorBoundary>
        <div>
          <Notification />
        </div>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              blog ? (
                <Blog blog={blog} setBlogs={setBlogs} user={user} />
              ) : (
                <div>blog not found</div>
              )
            }
          />
          <Route path="/" element={<Home blogs={blogs} />} />
          <Route
            path="/login"
            element={!user ? loginForm() : <Home blogs={blogs} />}
          />
          <Route
            path="/create"
            element={<NewPlog setBlogs={setBlogs} user={user} />}
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
