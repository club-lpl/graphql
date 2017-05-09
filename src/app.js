'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const { graphiqlExpress } = require('graphql-server-express')
const { graphqlHandler } = require('./resources')
const mongodb = require('mongodb')
const cors = require('cors')

const app = express()

const getDb = mongodb.MongoClient.connect('mongodb://localhost:27017/shh')

app.use(cors())

app.use(async (req, res, next) => {
  try {
    req.db = await getDb
  } catch (stupid) {
    return next(stupid)
  }
  return next()
})

app.use('/graphql', [bodyParser.json(), graphqlHandler])
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: 'ws://localhost:8000/subscriptions'
  })
)

module.exports = app
