import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, renderHook, act, screen } from '@testing-library/react'
import React from 'react'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './anecdotes'
import AnecdoteList from '../components/AnecdoteList'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('anecdote store', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test anecdote', votes: 0 },
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('AnecdoteList renders anecdotes sorted by votes', () => {
    const anecdotes = [
      { id: 1, content: 'Anecdote with one vote', votes: 1 },
      { id: 2, content: 'Anecdote with three votes', votes: 3 },
      { id: 3, content: 'Anecdote with two votes', votes: 2 },
    ]
    useAnecdoteStore.setState({ anecdotes })

    render(React.createElement(AnecdoteList))

    const renderedAnecdotes = screen
      .getAllByText(/Anecdote with/)
      .map(element => element.textContent)

    expect(renderedAnecdotes).toEqual([
      'Anecdote with three votes',
      'Anecdote with two votes',
      'Anecdote with one vote',
    ])
  })

  it('useAnecdotes returns anecdotes filtered by content', () => {
    const anecdotes = [
      { id: 1, content: 'React patterns', votes: 4 },
      { id: 2, content: 'State management', votes: 2 },
      { id: 3, content: 'Testing React components', votes: 1 },
    ]
    useAnecdoteStore.setState({ anecdotes, filter: 'react' })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([anecdotes[0], anecdotes[2]])
  })

  it('incVote increases votes for an anecdote', async () => {
    const anecdote = { id: 1, content: 'Test anecdote', votes: 0 }
    const updatedAnecdote = { ...anecdote, votes: 1 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.incVote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
    expect(anecdoteService.update).toHaveBeenCalledWith(1, updatedAnecdote)
  })
})
