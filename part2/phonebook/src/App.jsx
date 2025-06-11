import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, setFilter }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange}/>
    </div>)

}

const PersonForm = ({ name, setName, number, setNumber, persons, setPersons }) => {
  const addNewPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: name, number: number }
    let filteredPersons = persons.filter((person) => person.name === name)
    if (filteredPersons.length === 0) {
      setPersons(persons.concat(newPerson))
    } else {
      alert(`${name} is already added to phonebook`)
    }
    setName('')
    setNumber('')
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNumber(event.target.value)
  }

  return (<>
      <form onSubmit={addNewPerson}>
        <div>
          name: <input value={name} onChange={handleNameChange}/>
        </div>
        <div>number: <input value={number} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>);
}

const PeopleAndNumbers = ({ persons, filter }) => {
  return (
    <>
    {persons.map((person) => person.name.toLowerCase().includes(filter.toLowerCase()) ? <div key={person.name}>{person.name} {person.number}</div> : null)}
    </>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(hook, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} setFilter={setNewFilter} />
      
      <h2>Add a new</h2>
      <PersonForm name={newName} setName={setNewName} number={newNumber} setNumber={setNewNumber} persons={persons} setPersons={setPersons} />
      
      <h2>Numbers</h2>
      <PeopleAndNumbers persons={persons} filter={newFilter} />
    </div>
  )
}

export default App