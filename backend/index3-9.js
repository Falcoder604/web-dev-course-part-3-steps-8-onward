const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Muistutus itselle: tässä on käytetty h1-headerin ympärillä "backtickkeja" - eli `-merkkiä! 
// muuten koodia ei lueta oikein
app.get('/info', (request, response) => {
    response.send(
      `
      <div>Phonebook has ${persons.length} people</div>
      <br>
      <div>The date is ${new Date()}</div>
      `
    )
    })



app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})


// Käyttää Math.randomia satunnaisen luvun generoimiseen, ja 
// korottaa sen karkeasti alueelle 10-100. 
const generateId = () => {
  const newPersonId = Math.floor(Math.random() * (10 - 100) + 100)
  return String(newPersonId)
}


// TÄMÄ VERSIOINTITIEDOSTO SISÄLTÄÄ MOLEMMAT TEHTÄVÄT 3.5. JA 3.6.!!!
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  // nimen tarkastaja
  const nameExists = persons.some(p => p.name === body.name) // some on metodi, jolla voidaan tarkistaa, osuuko ehto johonkin alkioon

  if (!body.name || !body.number || nameExists) {
  return response.status(400).json({ 
    error: 'Name or number is missing, or your name must be unique!' 
  })
}

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

// Axios tarvitsee putin!
app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  const updatedPerson = {
    id,
    name: body.name,
    number: body.number,
  }

  persons = persons.map(p => p.id === id ? updatedPerson : p)

  response.json(updatedPerson)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

