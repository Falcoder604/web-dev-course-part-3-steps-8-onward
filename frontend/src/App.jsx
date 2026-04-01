import { useState, useEffect } from 'react'
import personService from './services/persons'
import './styles.css'

const FilterForm = ({ searchTerm, setSearchTerm }) => {
  return (
    <form>
      <div>filter shown with <input onChange={e => setSearchTerm(e.target.value)} value={searchTerm} /></div>
    </form>
  )
}

const PersonForm = ({ addPerson, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <form>
      <div>
        <div>name: <input value={newName} onChange={e => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} /></div>
      </div>
      <div>
        <button type="submit" onClick={addPerson} >add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, onDeletePerson }) => {
  return (
    persons.map(person => <Person key={person.id} person={person} onDeletePerson={onDeletePerson} />)
  )
}

const Person = ({ person, onDeletePerson }) => {
  return (
    <li>{person.name} {person.number} <button onClick={() => onDeletePerson(person)}>delete</button></li>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  const filteredPersons = persons.filter(person => person.name.toUpperCase().includes(searchTerm.toUpperCase()))

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    return () => clearTimeout(timeoutId);
  }, [notificationMessage])

  const addPerson = (e) => {
    e.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    setNewName('')
    setNewNumber('')
    if (persons.some(person => person.name === newPerson.name)) {
      modifyPerson(newPerson); return;
    }
    personService.create(newPerson)
      .then(savedPerson => {
        setNotificationMessage(`Added ${newPerson.name}`)
        setPersons(prev => [...prev, savedPerson])
      })
  }

  const modifyPerson = (newPerson) => {
    if (!window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) return;
    const oldPerson = persons.find(p => p.name === newPerson.name)
    personService.update(oldPerson.id, newPerson)
      .then(updatedPerson => {
        setNotificationMessage(`Modified ${newPerson.name}`)
        setPersons(prev => prev.map(p => p.id !== oldPerson.id ? p : updatedPerson))
      })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) return;
    // Important: Remove the person from view AFTER the server confirms succesful deletion
    personService.remove(person.id)
      .then(() => {
        setNotificationMessage(`Removed ${person.name}`)
        setPersons(persons.filter(p => person.id !== p.id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <FilterForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDeletePerson={deletePerson} />
    </div>
  )

}

export default App
