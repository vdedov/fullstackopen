import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <TextField
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            <TextField
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <Button type="submit" variant="contained">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
