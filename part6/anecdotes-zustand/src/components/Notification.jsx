import { useNotifications } from '../stores/notifications'

const Notification = () => {
  const notifications = useNotifications()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div>
      { notifications && <div style={style}>{notifications}</div> }
    </div>
  )
}

export default Notification
