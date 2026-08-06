import { useUniActions } from '../stores/unicafe'

const Buttons = () => {
  const {incGood, incNeutral, incBad} = useUniActions()
  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={incGood}>good</button>
      <button onClick={incNeutral}>neutral</button>
      <button onClick={incBad}>bad</button>
    </div>
  )
}

export default Buttons