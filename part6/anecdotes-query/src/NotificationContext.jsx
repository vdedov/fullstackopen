import { createContext, useState } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState('')

  const newNotification = text => {
    setNotification(text)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, newNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}
