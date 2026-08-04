import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const Login = ({ setUser, setNotification }) => {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  
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
      setNotification({ text: 'wrong username or password', isError: true})
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }
  
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default Login