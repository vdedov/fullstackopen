import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import Error from './components/Error'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Error>
    <Router>
      <App />
    </Router>
  </Error>,
)
