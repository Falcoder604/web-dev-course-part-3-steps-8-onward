import axios from 'axios'
// For Ex. 2.13
const baseUrl = 'http://localhost:3001/api/persons'


const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const create = newPerson => {
  return axios.post(baseUrl, newPerson).then(response => response.data)
}

// Ex. 2.14
const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

// Ex. 2.15
const update = (id, newPerson) => {
    return axios.put(`${baseUrl}/${id}`, newPerson).then(response => response.data)
}

export default { 
  getAll, 
  create,
  remove,
  update
}
