import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res
      .setHeader('Content-Type', 'application/json')
      .end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if(!req.body || !req.body.title || !req.body.description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'Title and description are required'
        }))
      }

      const { title, description } = req.body
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      }
  
      database.insert('tasks', task)
  
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      if(!req.body || !req.body.title || !req.body.description) {
        return res.writeHead(400).end(JSON.stringify({
          message: 'Title and description are required'
        }))
      }
      
      const { id } = req.params
      const { title, description } = req.body

      database.update('tasks', id, {
        title,
        description,
        updatedAt: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      database.update('tasks', id, {
        completedAt: new Date(),
        updatedAt: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const execute = database.delete('tasks', id)

      if(execute?.message) {
        return res.writeHead(404).end(JSON.stringify(execute))
      }

      return res.writeHead(204).end()
    }
  }
]
