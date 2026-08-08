import { useState, useEffect } from 'react'
import anecdoteServices  from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => setValue('')

  return {
    props: {
      type,
      value,
      onChange,
    },
    reset: reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    const fetchAnecdotes = async () => {
    await anecdoteServices.
      getAll().
      then(resp => setAnecdotes(resp))
    }

    fetchAnecdotes()
  }, [])

  const addAnecdote = async (anecdote) => {
    await anecdoteServices
      .createNew(anecdote)
      .then(resp => setAnecdotes(anecdotes.concat(resp)))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteServices.remove(id)
      .then(setAnecdotes(anecdotes.filter(a => a.id !== id)))
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}
