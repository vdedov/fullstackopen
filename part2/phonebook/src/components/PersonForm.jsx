import { useState } from 'react'
import Field from "./Field"
import personService from "../services/persons"

const Button = ({ text }) => (
  <div>
    <button type="submit">{ text }</button>
  </div>
)


const PersonForm = ({ persons, setPersons, notification, setNotification }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    const existedPerson = persons.find(p => p.name === newName)

    if (existedPerson) {
      if (!window.confirm(`${existedPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }

      const newObject = {
        ...existedPerson,
        number: newNumber,
      }

      personService
        .update(existedPerson.id, newObject)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id === existedPerson.id ? returnedPerson : p))
        })
        .catch(error => {
          setNotification({
            text: `Information of ${newObject.name} has already been deleted from server`,
            isError: true
          })
          setPersons(persons.filter(p => p.id !== existedPerson.id))
          setTimeout(() => {
            setNotification(null)
          }, 2000)
        })
    } else {
      const newObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(newObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification({
            text: `Added ${newObject.name}`,
            isError: false
          })
          setTimeout(() => {
            setNotification(null)
          }, 2000)
        })
        .catch(error => {
          setNotification({
            text: error.response.data.error,
            isError: true
          })
          setTimeout(() => {
            setNotification(null)
          }, 2000)
        })
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
