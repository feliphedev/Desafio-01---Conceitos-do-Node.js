const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers
  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(400).json({ error: 'user not found' })
  }

  request.user = user
  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  if (users.some((user) => user.username === username)) {
    return response.status(400).json({ error: 'there is a user with that username' })
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  users.push(user)
  return response.status(201).send()
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  return response.status(200).json({ todos: user.todos })
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { title, deadline } = request.body

  const task = {
    id: uuidv4(), // precisa ser um uuid
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date
  }

  user.todos.push(task)

  return response.status(201).json({ message: 'task including with success' })
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { title, deadline } = request.body

  if (!user.todos.some((task) => task.id === request.params.id)) {
    return response.status(400).json({ message: 'task not found' })
  }

  const task = user.todos.find(task => task.id === request.params.id)
  task.title = title
  task.deadline = new Date(deadline)

  return response.status(200).json({ message: 'task successfully updated' })
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  if (!user.todos.some((task) => task.id === request.params.id)) {
    return response.status(400).json({ message: 'task not found' })
  }

  const task = user.todos.find(task => task.id === request.params.id)
  task.done = true

  return response.status(200).json({ message: 'task successfully done' })
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  if (!user.todos.some((task) => task.id === request.params.id)) {
    return response.status(400).json({ message: 'task not found' })
  }

  const task = user.todos.findIndex(task => task.id === request.params.id)
  user.todos.splice(task, 1)

  return response.status(200).json({ message: 'task defelete successfully' })
});

module.exports = app;