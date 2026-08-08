import { useNotifications } from '../stores/notifications'

const Notification = () => {
  const notification = useNotifications()
  if (notification === null) {
    return null
  }

  return (
    <div
      className={
        notification.isError ? 'notification error' : 'notification success'
      }
    >
      {notification.text}
    </div>
  )
}

export default Notification
