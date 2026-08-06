import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

export const useNotificator = () => useContext(NotificationContext)

export default useNotificator
