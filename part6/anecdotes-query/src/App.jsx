import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const { anecdotes, incVote, isPending, isError } = useAnecdotes()

  const handleVote = (anecdote) => {
    incVote({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  if (isPending) {
    return <div>loading data...</div>
  } else if (isError) {
    return <div>anecdote server not available due to problems in server...</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
