import { useAnecdotes } from '../hooks/useAnecdotes'
import { useNotificator } from '../hooks/useNotificatior'

const AnecdoteForm = () => {
  const { addAnecdote: addAnecdoteToServer } = useAnecdotes()
  const { newNotification } = useNotificator()
  
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    addAnecdoteToServer(content)
    newNotification(`anecdote ${content} was added`)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm