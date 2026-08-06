import { create } from 'zustand'

let notificationTimer

const useNotificationsStore = create((set) => ({
  notification: '',
  actions: {
    setNotification: text => {
        clearTimeout(notificationTimer)
        set(() => ({ notification: text } ))
        notificationTimer = setTimeout(() => {
          set({ notification: '' })
          notificationTimer = undefined
        }, 5000)
      }
    }
}))


export const useNotifications = () => useNotificationsStore(state => state.notification)
export const useNotificationActions = () => useNotificationsStore(state => state.actions)