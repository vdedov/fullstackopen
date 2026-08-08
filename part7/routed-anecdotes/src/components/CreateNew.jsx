import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks/index'

const CreateNew = () => {
  const content = useField('content')
  const author = useField('author')
  const info = useField('info')
  const navigate = useNavigate()

  const { addAnecdote } = useAnecdotes()
  
  const handleSubmit = (e) => {
    e.preventDefault()

    const newObject = {
      content: content.props.value,
      author: author.props.value,
      info: info.props.value,
      votes: 0
    }
    addAnecdote(newObject)
    navigate('/')
  }

  const handleClick = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content <input {...content.props} />
        </div>
        <div>
          author <input {...author.props} />
        </div>
        <div>
          url for more info <input {...info.props} />
        </div>
        <button>create</button>
        <button onClick={handleClick}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew