import { useAnecdotes, useAnecdoteActions } from '../stores/anecdotes'
import { useNotificationActions } from '../stores/notifications'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { incVote, remove } = useAnecdoteActions()
  
  const { setNotification } = useNotificationActions()

  const vote = anecdote => {
    incVote(anecdote.id)
    setNotification(`You voted "${anecdote.content}"`)
  }

  const removeAnecdote = id => {
    remove(id)
  }

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
  
  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
            {anecdote.votes === 0
              && <button onClick={() => removeAnecdote(anecdote.id)}>remove</button>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
