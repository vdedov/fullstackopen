import { useState, useEffect } from 'react'
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Notification from "./components/Notification"
import personService from "./services/persons"

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const [newFilter, setNewFilter] = useState('')

  const personsToShow = newFilter == ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(newFilter)
    )

  const [notification, setNotification] = useState(null)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={ notification } />
      <Filter
        newFilter={newFilter}
        setNewFilter={setNewFilter}
      />

      <h3>add a new</h3>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        notification={notification}
        setNotification={setNotification}
      />

      <h3>Numbers</h3>
      <Persons
        persons={personsToShow}
        setPersons={setPersons}
      />
    </div>
  )
}

export default App
