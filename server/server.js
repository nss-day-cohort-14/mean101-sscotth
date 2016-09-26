'use strict'

const express = require('express')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('client'))

app.get('/api/title', (req, res) =>
  res.json({ title: 'MEAN Chat' })
)

app.get('/api/messages', (req, res) =>
  res.json({
    messages: [
      {
        author: 'John',
        content: 'Get a Job!',
      },
      {
        author: 'Scott',
        content: 'Node is Awesome!',
      },
    ],
  })
)

app.listen(port, () => console.log(`Listening on port: ${port}`))
