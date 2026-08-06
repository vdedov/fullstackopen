import { create } from 'zustand'

const useUnicafeCounter = create((set) => ({
  counters: {
    good: 0,
    neutral: 0,
    bad: 0,
  },

  actions: {
    incGood: () => set(state => ({
        counters: {
          ...state.counters,
          good: state.counters.good + 1,
        },
      })),

    incNeutral: () => set(state => ({
        counters: {
          ...state.counters,
          neutral: state.counters.neutral + 1,
        },
      })),

    incBad: () => set(state => ({
        counters: {
          ...state.counters,
          bad: state.counters.bad + 1,
        },
      })),
  },
}))

export const useUniCounters = () => useUnicafeCounter(state => state.counters)
export const useUniActions = () => useUnicafeCounter(state => state.actions)
