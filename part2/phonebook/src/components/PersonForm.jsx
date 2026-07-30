import { useState } from 'react'
import Field from "./Field"

const Button = ({ text }) => (
  <div>
    <button type="submit">{ text }</button>
  </div>
)


const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name == newName)) {
      alert(`${ newName } is already added to phonebook`)
    } else {
      const newObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      }

      setPersons(persons.concat(newObject))
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={addPerson}>
      <Field
        text="name"
        value={ newName }
        onChange={ handleNameChange }
      />
      <Field
        text="number"
        value={ newNumber }
        onChange={ handleNumberChange }
      />
      <Button text="add"/>
    </form>
  )
}

export default PersonForm
