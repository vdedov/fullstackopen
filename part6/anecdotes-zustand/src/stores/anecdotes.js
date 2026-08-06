import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { devtools } from 'zustand/middleware'

import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create(devtools((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    incVote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a)
      }))
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) })) 
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter(a => a.id !== id) })) 
    },
    setFilter: value => set(() => ({ filter: value }))
  },
})))

export const useAnecdotes = () => useAnecdoteStore(useShallow(({ anecdotes, filter }) => {
  if (filter === '') return anecdotes
  return anecdotes.filter(anecdote =>
    anecdote.content
      .toLowerCase()
      .includes(filter.toLowerCase())
  )})
)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export default useAnecdoteStore
