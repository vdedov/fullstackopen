const Person = ({ name, number }) => (
  <div>
    { name } { number }
  </div>
)

const Persons = (props) => {
  return (
    <div>
        {props.persons.map(person =>
          <Person
            key={ person.id }
            name={ person.name }
            number={ person.number }
          />
        )}
    </div>
  )
}

export default Persons
