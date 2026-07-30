import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
    })
  }, [])

  const [newFilter, setNewFilter] = useState('')

  const personsToShow = newFilter == ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(newFilter)
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        newFilter={newFilter}
        setNewFilter={setNewFilter}
      />

      <h3>add a new</h3>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
      />

      <h3>Numbers</h3>
      <Persons
        persons={personsToShow}
      />
    </div>
  )
}

export default App
