import Field from "./Field"

const Filter = ({ newFilter, setNewFilter }) => {
  const hahdleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <Field
      text="filter shown with"
      value={ newFilter }
      onChange={ hahdleFilterChange }
    />
  )
}

export default Filter
