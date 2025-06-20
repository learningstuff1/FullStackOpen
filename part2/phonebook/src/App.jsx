import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook.js'
import './index.css'

const Filter = ({ filter, setFilter }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange}/>
    </div>)

}

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="notif">
      {message}
    </div>
  )
}

const ErrorNotif = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const PersonForm = ({ onAddPerson, returnPersonIfPresent, onUpdatePerson, onFailedUpdate }) => {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const addNewPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: name, number: number }
    let personIfExists = returnPersonIfPresent(name) 
    if (personIfExists === null) {
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          onAddPerson(returnedPerson)
        })
    } else {
      const id = personIfExists.id 
      if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookService.update(id, newPerson)
          .then(returnedPerson => {
            onUpdatePerson(returnedPerson)
          })
          .catch(() => onFailedUpdate(name))
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
      .then(removePerson(person.name))
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
  const [notifMessage, setNotifMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    phonebookService
      .getAll()
      .then(allNotes => {
        setPersons(allNotes)
      })
  }

  useEffect(hook, [])

  const handleAddPerson = (returnedPerson) => {
    setPersons(persons.concat(returnedPerson))
    setNotifMessage(`Added ${returnedPerson.name}`)
    setTimeout(() => {
      setNotifMessage(null)
    }, 5000)
  }

  const returnPersonIfPresent = (name) => {
    const filteredPersons = persons.filter((person) => person.name === name)
    if (filteredPersons.length === 0) {
      return null
    }
    return filteredPersons.at(0)
  }

  const handleUpdatePerson = (returnedPerson) => {
    const personsRemovedUpdated = persons.filter((person) => person.name !== returnedPerson.name)
    setPersons(personsRemovedUpdated.concat(returnedPerson))
    setNotifMessage(`Updated number for ${returnedPerson.name}`)
    setTimeout(() => {
      setNotifMessage(null)
    }, 5000)
  }

  const handleFailedUpdate = (name) => {
    setErrorMessage(`Information of ${name} has already been removed from server`)
    removePerson(name)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

  }

  const removePerson = (name) => {
    const filteredPersons = persons.filter(person => person.name !== name)
    setPersons(filteredPersons)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage}/>
      <ErrorNotif message={errorMessage}/>
      <Filter filter={newFilter} setFilter={setNewFilter} />
      
      <h2>Add a new</h2>
      <PersonForm onAddPerson={handleAddPerson} returnPersonIfPresent={returnPersonIfPresent} onUpdatePerson={handleUpdatePerson} onFailedUpdate={handleFailedUpdate}  />
      
      <h2>Numbers</h2>
      <PeopleAndNumbers persons={persons} filter={newFilter} removePerson={removePerson} />
    </div>
  )
}

export default App