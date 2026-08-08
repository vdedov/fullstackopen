import { create } from 'zustand'

let notificationTimer

const useNotificationsStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: (text, isError) => {
      clearTimeout(notificationTimer)
      set(() => ({ notification: { text, isError } }))
      notificationTimer = setTimeout(() => {
        set({ notification: null })
        notificationTimer = undefined
      }, 5000)
    },
  },
}))

export const useNotifications = () =>
  useNotificationsStore((state) => state.notification)
export const useNotificationActions = () =>
  useNotificationsStore((state) => state.actions)
