'use strict'

const { json } = require('body-parser')
const { Server } = require('http')
const express = require('express')
const mongoose = require('mongoose')
const socketio = require('socket.io')

const app = express()
const server = Server(app)
const io = socketio(server)

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/meanchat'
const PORT = process.env.PORT || 3000

app.use(express.static('client'))
app.use(json())

app.get('/api/title', (req, res) =>
  res.json({ title: 'MEAN Chat' })
)

const Message = mongoose.model('message', {
  author: String,
  content: String,
})

app.get('/api/messages', (req, res, err) =>
  Message
    .find()
    .then(messages => res.json({ messages }))
    .catch(err)
)

app.post('/api/messages', (req, res, err) =>
  Message
    .create(req.body)
    .then(msg => {
      io.emit('newMessage', msg)
      return msg
    })
    .then(msg => res.status(201).json(msg))
    .catch(err)
)

app.use('/api', (req, res) =>
  res.status(404).send({ code: 404, status: 'Not Found' })
)

app.use((req, res) =>
  res.sendFile(process.cwd() + '/client/index.html')
)

app.use((err, req, res, next) =>
  res.status(500).send({ code: 500, status: 'Internal Server Error', detail: err.stack })
)

mongoose.Promise = Promise
mongoose.connect(MONGODB_URL, () =>
  server.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
)

io.on('connection', socket => {
  console.log(`Socket connected: ${socket.id}`)
  socket.on('disconnect', () => console.log(`Socket disconnected: ${socket.id}`))
  socket.on('postMessage', msg =>
     Message
      .create(msg)
      .then(msg => io.emit('newMessage', msg))
      .catch(console.error)
  )
})
