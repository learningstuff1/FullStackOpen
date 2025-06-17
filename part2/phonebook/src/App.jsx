import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook.js'

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
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    } else {
      const id = filteredPersons.at(0).id 
      if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookService.update(id, newPerson)
          .then(returnedPerson => {
            const personsRemovedUpdated = persons.filter((person) => person.name !== name)
            setPersons(personsRemovedUpdated.concat(returnedPerson))
          })
      }
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

const PeopleAndNumbers = ({ persons, filter, removePerson }) => {
  const promptToRemove = (person) => {
    if (window.confirm(`Remove ${person.name}?`)) {
      phonebookService.removePerson(person.id)
      .then(removePerson(person.id))
    }
  }

  return (
    <>
    {persons.map((person) => person.name.toLowerCase().includes(filter.toLowerCase()) ? <div key={person.name}>
      {person.name} {person.number}
      <button onClick={() => promptToRemove(person)}>delete</button>
      </div> 
      : null)}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const hook = () => {
    phonebookService
      .getAll()
      .then(allNotes => {
        setPersons(allNotes)
      })
  }

  useEffect(hook, [])

  const removePerson = (id) => {
    const filteredPersons = persons.filter(person => person.id !== id)
    setPersons(filteredPersons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} setFilter={setNewFilter} />
      
      <h2>Add a new</h2>
      <PersonForm name={newName} setName={setNewName} number={newNumber} setNumber={setNewNumber} persons={persons} setPersons={setPersons} />
      
      <h2>Numbers</h2>
      <PeopleAndNumbers persons={persons} filter={newFilter} removePerson={removePerson} />
    </div>
  )
}

export default App