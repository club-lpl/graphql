'use strict'

const http = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const app = require('./src/app')
const { subscriptionManager } = require('./src/resources')

const PORT = process.env.PORT || 8000
const server = http.createServer(app)

server
  .listen(PORT)
  .on('listening', () => console.log(`Server listening on port ${PORT}`))
  .on('error', err => console.log('Error starting up server', err))

const wsServer = new SubscriptionServer(
  {
    subscriptionManager
  },
  {
    server,
    path: '/subscriptions'
  }
)
