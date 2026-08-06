import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdoteActions()

  const anecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    addAnecdote(content)
    e.target.reset()
  }
  
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={anecdote}>
        <div>
          <input name="anecdote"/>
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm