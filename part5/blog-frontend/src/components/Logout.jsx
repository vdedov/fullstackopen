import blogService from '../services/blogs'

const Logout = ({ setUser }) => {
  const setLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser') 
    blogService.removeToken()
  }

  return (
    <button onClick={() => setLogout()}>logout</button>
  )
}

export default Logout
