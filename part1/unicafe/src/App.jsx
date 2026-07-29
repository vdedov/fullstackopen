import { useState } from 'react'

const Title = ({ text }) => <div><h1>{ text }</h1></div>

const Button = (props) => <button onClick={ props.onClick }>{ props.text }</button>

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{ text }</td>
      <td>{ value }</td>
    </tr>
  )
}


const Staistics = (props) => {
  if (props.all === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={ props.good } />
          <StatisticLine text="neutral" value={ props.neutral } />
          <StatisticLine text="bad" value={ props.bad } />
          <StatisticLine text="all" value={ props.all } />
          <StatisticLine text="average" value={ props.average } />
          <StatisticLine text="positive" value={props.positive + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <Title text="give feedback" />
      <Button text="good" onClick={ () => setGood(good + 1) } />
      <Button text="neutral" onClick={ () => setNeutral(neutral + 1) } />
      <Button text="bad" onClick={ () => setBad(bad + 1) } />

      <Title text="statistics" />
      <Staistics
        good={ good }
        neutral={ neutral }
        bad={ bad }
        all={ all }
        average={ average }
        positive={ positive}
      />
    </div>
  )
}

export default App
