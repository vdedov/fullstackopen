import blogService from '../services/blogs'

import { Button } from '@mui/material'

const Logout = ({ setUser }) => {
  const setLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.removeToken()
  }

  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Button color="inherit" onClick={setLogout} sx={hoverStyle}>
      logout
    </Button>
  )
}

export default Logout
