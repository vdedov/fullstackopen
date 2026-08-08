import React from 'react'

class Error extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Error caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>Something went wrang :/</h3>
          <p>Please make a bug report to ...</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default Error
