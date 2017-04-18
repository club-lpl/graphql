'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const schema = require('./resources')

const app = express()

app.use('/graphql', [
  bodyParser.json(),
  graphqlExpress((req) => ({
    schema
  }))
])
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

module.exports = app
