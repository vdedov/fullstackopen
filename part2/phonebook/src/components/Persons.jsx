import personService from "../services/persons"

const Person = ({ person, setPersons }) => {
  const handleRemovePerson = id => {   
    if (!window.confirm(`Delete ${person.name}`)) { 
      return
    }
    
    personService.remove(id).then(() => {
      setPersons(currentPersons => currentPersons.filter(p => p.id !== id))
    })
  }

  return (
  <div>
    {person.name} {person.number}
    <button onClick={() => handleRemovePerson(person.id)}>delete</button>
  </div>
  )
}

const Persons = ({persons, setPersons}) => {
  return (
    <div>
        {persons.map(person =>
          <Person
            key={person.id}
            person={person}
            setPersons={setPersons}
          />
        )}
    </div>
  )
}

export default Persons
